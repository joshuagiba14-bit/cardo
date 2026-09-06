import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../lib/app-error";

function zodErrorToFields(error: import("zod").ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

/** Validates and replaces req.body with the parsed (typed, defaulted) value. */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        AppError.badRequest("Validation failed", zodErrorToFields(result.error)),
      );
    }
    req.body = result.data;
    next();
  };
}

/** Validates and replaces req.query with the parsed (typed, defaulted) value. */
export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(
        AppError.badRequest("Validation failed", zodErrorToFields(result.error)),
      );
    }
    (req as Request & { validatedQuery: unknown }).validatedQuery = result.data;
    next();
  };
}
