import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@cardo/shared";
import { AUTH_COOKIE_NAME, verifyAuthToken, type AuthTokenPayload } from "../lib/jwt";
import { AppError } from "../lib/app-error";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    return next(AppError.unauthorized("Sign in required"));
  }
  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    next(AppError.unauthorized("Session expired, please sign in again"));
  }
}

/**
 * Sets req.user when a valid session cookie is present, but never rejects
 * the request. Used on GET endpoints that are public but show more data
 * (e.g. inactive offerings, unpublished case studies) to a signed-in staffer.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (token) {
    try {
      req.user = verifyAuthToken(token);
    } catch {
      // Invalid/expired token on a public route: treat as anonymous.
    }
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized("Sign in required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden("You don't have access to this action"));
    }
    next();
  };
}
