import type { ApiFieldError } from "@cardo/shared";

/** Thrown anywhere in a route/controller; caught by the centralized error handler. */
export class AppError extends Error {
  status: number;
  code: string;
  fields?: ApiFieldError[];

  constructor(status: number, code: string, message: string, fields?: ApiFieldError[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }

  static badRequest(message = "Bad request", fields?: ApiFieldError[]) {
    return new AppError(400, "bad_request", message, fields);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(401, "unauthorized", message);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(403, "forbidden", message);
  }

  static notFound(message = "Not found") {
    return new AppError(404, "not_found", message);
  }

  static conflict(message = "Conflict") {
    return new AppError(409, "conflict", message);
  }

  static tooManyRequests(message = "Too many requests") {
    return new AppError(429, "rate_limited", message);
  }
}
