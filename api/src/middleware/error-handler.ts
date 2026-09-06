import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "@cardo/shared";
import { AppError } from "../lib/app-error";
import { logger } from "../lib/logger";

/**
 * Every error in the app funnels here. Never leaks a stack trace or raw
 * error message from unexpected failures — only AppError messages (which
 * we write ourselves) reach the client.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    const body: ApiError = {
      ok: false,
      error: { code: err.code, message: err.message, fields: err.fields },
    };
    return res.status(err.status).json(body);
  }

  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");

  const body: ApiError = {
    ok: false,
    error: { code: "internal_error", message: "Something went wrong. Please try again." },
  };
  return res.status(500).json(body);
}

export function notFoundHandler(req: Request, res: Response) {
  const body: ApiError = {
    ok: false,
    error: { code: "not_found", message: `No route for ${req.method} ${req.path}` },
  };
  res.status(404).json(body);
}
