import type { NextFunction, Request, Response } from 'express';
import User from '../models/User.ts';
import { tryCatch } from '../utils/tryCatch.ts';
import HttpError from '../utils/HttpError.ts';

type UpdateObject = {
  first_name: string;
  last_name: string;
  email: string;
};

const filterObj = <T extends Record<string, unknown>>(
  obj: Record<string, unknown>,
  allowedFields: string[]
): T => {
  const newObj: Record<string, unknown> = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj as T;
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { data, error } = await tryCatch(User.find());

  if (error) return next(error);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: data,
  });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;

  const { data, error } = await tryCatch(User.findById(id));

  if (error) return next(error);

  if (!data) {
    return next(new HttpError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: data,
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) return next(new HttpError('No data provided.', 400));

  const allowedFields = ['firstName', 'last_name', 'email'];
  const filteredObj = filterObj<UpdateObject>(req.body, allowedFields);

  if (!req?.user?.id)
    return next(new HttpError('Please log in to continue.', 401));
  const { data: updatedUser, error: updateError } = await tryCatch(
    User.findByIdAndUpdate(req.user.id, filteredObj)
  );

  if (updateError) return next(updateError);

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  if (!id) return;

  const { data: deletedUser, error } = await tryCatch(User.findById(id));

  if (error) return next(error);

  if (!deletedUser) {
    return next(new HttpError('User not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
