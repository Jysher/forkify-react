import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import User from '../models/User.ts';
import { tryCatch } from '../utils/tryCatch.ts';
import HttpError from '../utils/HttpError.ts';

const signToken = (id: string, next: NextFunction): string | null => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    next(new HttpError('Environment variables not set.', 500));
    return null;
  }

  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
  });
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
  const userData = req.body;

  if (!userData) return next(new HttpError('No user data provided.', 400));

  // Register a new user
  const { data: newUser, error } = await tryCatch(User.create(userData));

  if (error) return next(error);

  const token = signToken(newUser._id.toString(), next);
  const noPasswordUser = {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  };

  res.status(201).json({
    status: 'success',
    token: token,
    data: noPasswordUser,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) return next(new HttpError('No login data provided.', 400));

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HttpError('Please provide email and password.', 400));
  }

  // Find user by email
  const { data: user, error } = await tryCatch(
    User.findOne({ email: email }).select('+password')
  );

  if (error) return next(error);

  if (
    !user ||
    !(await tryCatch(user.isCorrectPassword(password, user.password)))
  ) {
    return next(new HttpError('Incorrect email or password.', 401));
  }

  const token = signToken(user._id.toString(), next);

  res.status(200).json({
    status: 'success',
    token: token,
  });
};

export const auth = async (
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

  next();
};
