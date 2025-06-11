export class InternalServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = 'Internal Server Error';
  }
  statusCode = 500;
}

export class BadRequestError extends Error {
  constructor(message = 'Bad Request Error') {
    super(message);
    this.name = 'Bad Request Error';
  }
  statusCode: number = 400;
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized Error') {
    super(message);
    this.name = 'Unauthorized Error';
  }
  statusCode: number = 401;
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden Error') {
    super(message);
    this.name = 'Forbidden Error';
  }
  statusCode: number = 403;
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found Error') {
    super(message);
    this.message = 'Not Found Error';
  }
  statusCode: number = 404;
}

export type CustomError =
  | InternalServerError
  | BadRequestError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
