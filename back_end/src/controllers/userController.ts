import type { NextFunction, Request, Response } from 'express';
import User from '../models/User.ts';
import { tryCatch } from '../utils/tryCatch.ts';
import HttpError from '../utils/HttpError.ts';

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
