export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, unknown>;

  constructor(statusCode: number, message: string, errors?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
