import { ApiError } from '../apiError.ts';

export class BadRequestError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Bad Request',
  ) {
    super(400, message, errors);
  }
}

export class ValidationError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Validation Error',
  ) {
    super(422, message, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Resources Not Found',
  ) {
    super(404, message, errors);
  }
}

export class ConflictError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Conflict',
  ) {
    super(409, message, errors);
  }
}

export class UnauthorizeError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Not Authorized',
  ) {
    super(401, message, errors);
  }
}

export class InternalServerError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Internal Server Error',
  ) {
    super(500, message, errors);
  }
}
