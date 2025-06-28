import type { Document, Types } from 'mongoose';
import type { IUser } from '../models/User.ts';

declare global {
  namespace Express {
    interface Request {
      user?: Document<unknown, object, IUser, object> &
        IUser & { _id: Types.ObjectId } & { __v: number };
    }
  }
}

export {};
