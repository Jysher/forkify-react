import crypto from 'crypto';
import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  photo?: string;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiration?: Date;
  isCorrectPassword(plainPass: string, hashPass: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number | undefined): boolean;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'Role must be either: admin or user',
    },
    default: 'user',
  },
  photo: String,
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpiration: {
    type: Date,
    select: false,
  },
});

userSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next): void {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.isCorrectPassword = async function (
  plainPass: string,
  hashPass: string
): Promise<boolean> {
  return await bcrypt.compare(plainPass, hashPass);
};

userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number | undefined
): boolean {
  if (this.passwordChangedAt && JWTTimestamp) {
    const changedTimestamp =
      parseInt(this.passwordChangedAt.getTime(), 10) / 1000;

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpiration = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export default model<IUser>('User', userSchema);
