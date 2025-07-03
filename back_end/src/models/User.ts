import crypto from 'crypto';
import { Model, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  photo?: string;
  password_changed_at?: Date;
  reset_password_token?: string;
  reset_password_expiration?: Date;
}

interface IUserMethods {
  isCorrectPassword(plainPass: string, hashPass: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number | undefined): boolean;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<IUser, Model<IUser>, IUserMethods>(
  {
    first_name: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
    },
    last_name: {
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
    password_changed_at: Date,
    reset_password_token: String,
    reset_password_expiration: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

userSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next): void {
  if (!this.isModified('password') || this.isNew) return next();

  this.password_changed_at = new Date(Date.now() - 1000);
  next();
});

userSchema.pre('find', function (next): void {
  this.find({ active: { $ne: false } });
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
  if (this.password_changed_at && JWTTimestamp) {
    const changedTimestamp = this.password_changed_at.getTime() / 1000;

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.reset_password_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.reset_password_expiration = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

export default model('User', userSchema);
