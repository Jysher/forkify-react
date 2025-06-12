import { type NextFunction, type Request, type Response } from 'express';
import { type CustomError } from './errors.ts';

export default function errorHanlder(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode).json({
    status: 'error',
    error: err.name,
    message: err.message,
    stack: err.stack,
  });
  next();
}
