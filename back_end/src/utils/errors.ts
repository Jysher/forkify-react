export class InternalServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
  }
  statusCode = 500;
}

export class BadRequestError extends Error {
  constructor(message = 'Bad Request Error') {
    super(message);
  }
  statusCode: number = 400;
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized Error') {
    super(message);
  }
  statusCode: number = 401;
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden Error') {
    super(message);
  }
  statusCode: number = 403;
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found Error') {
    super(message);
  }
  statusCode: number = 404;
}

export type CustomError =
  | InternalServerError
  | BadRequestError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
