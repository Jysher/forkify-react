import type { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import User from '../models/User.ts';
import tryCatch from '../utils/tryCatch.ts';
import HttpError from '../utils/HttpError.ts';
import sendEmail from '../email/nodemailer.ts';
import sanitizeInput from '../utils/sanitizeInput.ts';
import filterObject from '../utils/filterObject.ts';

const signToken = (id: string, next: NextFunction): string | void => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN)
    return next(new HttpError('Environment variables not set.', 500));

  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60,
  });
};

const sendJWTCookie = (token: string | void, res: Response): void => {
  const cookieOptions: Record<string, unknown> = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
};

const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) {
      reject(new HttpError('Environment variables not set.', 500));
      return;
    }

    try {
      resolve(jwt.verify(token, process.env.JWT_SECRET) as JwtPayload);
    } catch (error) {
      reject(error);
    }
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) return next(new HttpError('No user data provided.', 400));

  type UserData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };

  const targetData: UserData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  };

  const userData = sanitizeInput<UserData>(
    filterObject(req.body, Object.keys(targetData)),
    targetData
  );

  // Register a new user
  const { data: newUser, error } = await tryCatch(User.create(userData));

  if (error) return next(error);

  const token = signToken(newUser.id, next);
  sendJWTCookie(token, res);

  res.status(200).json({
    status: 'success',
    message: 'Login successful!',
    token: token,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) return next(new HttpError('No login data provided.', 400));

  type LoginData = {
    email: string;
    password: string;
  };

  const targetData: LoginData = {
    email: '',
    password: '',
  };

  const { email, password } = sanitizeInput<LoginData>(
    filterObject(req.body, Object.keys(targetData)),
    targetData
  );

  if (!email || !password) {
    return next(new HttpError('Please provide email and password.', 400));
  }

  console.log(typeof email);
  // Find user by email
  const { data: user, error } = await tryCatch(
    User.findOne({ email: email }).select('+password')
  );

  if (error) return next(error);

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new HttpError('Incorrect email or password.', 401));
  }

  const token = signToken(user.id, next);
  sendJWTCookie(token, res);

  res.status(200).json({
    status: 'success',
    message: 'Log in successful!',
    token: token,
  });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next();
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(new HttpError('Please log in to continue.', 401));

  const token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new HttpError('Please log in to continue.', 401));

  const { data: decoded, error: jwtError } = await tryCatch(verifyToken(token));

  if (jwtError) return next(jwtError);

  const { data: freshUser, error } = await tryCatch(User.findById(decoded.id));
  if (error) return next(error);
  if (!freshUser) return next(new HttpError('User does not exist.', 401));

  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new HttpError('User recently changed password. Please log in again.', 401)
    );

  req.user = freshUser;
  next();
};

export const authorize =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) return next(new HttpError('Please log in to continue', 401));
    if (!roles.includes(req.user.role))
      return next(new HttpError('Insufficient permissions.', 403));

    next();
  };

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) return next(new HttpError('No email provided.', 400));

  type ForgotPasswordData = {
    email: string;
  };
  const targetData: ForgotPasswordData = {
    email: '',
  };

  const { email } = sanitizeInput<ForgotPasswordData>(
    filterObject(req.body, ['email']),
    targetData
  );

  const { data: user, error: findError } = await tryCatch(
    User.findOne({ email: email })
  );
  if (findError) return next(findError);
  if (!user) return next(new HttpError('No user found.', 404));

  const resetToken = user.createPasswordResetToken();
  const { error: saveError } = await tryCatch(
    user.save({ validateBeforeSave: false })
  );
  if (saveError) return next(saveError);

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetUrl}\nIf you didn't forget your password, please ignore this email!`;

  const { error: sendEmailError } = await tryCatch(
    sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min).',
      message: message,
    })
  );

  if (sendEmailError) {
    user.reset_password_token = undefined;
    user.reset_password_expiration = undefined;

    const { error: saveError } = await tryCatch(
      user.save({ validateBeforeSave: false })
    );

    if (saveError) return next(saveError);
    next(
      new HttpError(
        'Something went wrong sending the email. Please try again later.',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Reset password token sent.',
  });
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.params.token;
  if (!token) return;

  if (!req.body)
    return next(new HttpError('Please input a new password.', 400));

  type ResetPasswordData = {
    password: string;
  };

  const targetData: ResetPasswordData = {
    password: '',
  };

  const { password: newPassword } = sanitizeInput<ResetPasswordData>(
    filterObject(req.body, ['password']),
    targetData
  );

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const { data: user, error } = await tryCatch(
    User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiration: { $gt: Date.now() },
    })
  );

  if (error) return next(error);
  if (!user) return next(new HttpError('Token is invalid or has expired', 400));

  user.password = newPassword;
  user.reset_password_token = undefined;
  user.reset_password_expiration = undefined;

  const { error: saveError } = await tryCatch(user.save());
  if (saveError) return next(saveError);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful. Please log in with your new password.',
  });
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req?.user?.id;
  if (!id) return next(new HttpError('Please log in to continue.', 401));

  if (!req.body)
    return next(
      new HttpError('No current password & new password provided.', 400)
    );

  type UpdatePasswordData = {
    currentPassword: string;
    newPassword: string;
  };

  const targetData: UpdatePasswordData = {
    currentPassword: '',
    newPassword: '',
  };

  const { currentPassword, newPassword } = sanitizeInput<UpdatePasswordData>(
    filterObject(req.body, ['currentPassword', 'newPassword']),
    targetData
  );

  const { data: user, error: findError } = await tryCatch(
    User.findById(id).select('+password')
  );
  if (findError) return next(findError);
  if (!user) return next(new HttpError('No user found.', 404));

  if (!(await user.isCorrectPassword(currentPassword, user.password)))
    return next(new HttpError('Incorrect password.', 401));

  user.password = newPassword;

  const { error: saveError } = await tryCatch(user.save());
  if (saveError) return next(saveError);

  const token = signToken(user.id, next);

  res.status(200).json({
    status: 'success',
    token: token,
  });
};
