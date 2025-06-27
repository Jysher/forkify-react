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
  isCorrectPassword(plainPass: string, hashPass: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number | undefined): boolean;
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
});

userSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
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

export default model<IUser>('User', userSchema);
