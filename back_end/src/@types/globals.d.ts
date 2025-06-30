import type { Document } from 'mongoose';
import type { IUser } from '../models/User.ts';

interface IUserDoc extends IUser, Document {}

declare global {
  namespace Express {
    interface Request {
      // user?: Document<unknown, object, IUser, object> &
      //   IUser & { _id: Types.ObjectId } & { __v: number };
      user?: IUserDoc;
    }
  }
}

export {};
