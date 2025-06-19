import { type NextFunction, type Request, type Response } from 'express';
import { type CustomError } from './errors.ts';

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
  next();
}
