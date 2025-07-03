import { type NextFunction, type Request, type Response } from 'express';
import type { CastError } from 'mongoose';
import HttpError from '../utils/HttpError.ts';

const handleCastErrorDB = (err: CastError): HttpError => {
  return new HttpError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = (err: unknown): HttpError => {
  // const error = err as { errmsg: string; keyValue: Record<string, unknown> };
  // const value = error.errmsg.match(/"([^"]+)"/g);
  const error = err as { keyValue: Record<string, unknown> };
  const keys = Object.keys(error.keyValue);
  const values = Object.values(error.keyValue);

  const message = `The field(s): [${keys.join(
    ', '
  )}] with value(s): [${values.join(
    ', '
  )}] already exists. Please use another value.`;
  return new HttpError(message, 400);
};

const handleValidationErrorDB = (err: unknown): HttpError => {
  const errors = Object.values((err as { errors: object }).errors).map(
    el => el.message
  );
  return new HttpError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = (): HttpError =>
  new HttpError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = (): HttpError =>
  new HttpError('Token expired. Please log in again.', 401);

const parseError = (err: Error): HttpError => {
  if (err.name === 'CastError') return handleCastErrorDB(err as CastError);
  if ('code' in err && err.code === 11000) return handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') return handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') return handleJWTError();
  if (err.name === 'TokenExpiredError') return handleJWTExpiredError();
  if (err instanceof HttpError) return err;
  return new HttpError('An unexpected error occurred.', 500);
};

export default function errorController(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error: HttpError = parseError(err);

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
    res.status(error.statusCode).json({
      status: 'error',
      error: error,
      message: error.message,
      stack: error.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
  next();
}
