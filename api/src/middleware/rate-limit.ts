import rateLimit from "express-rate-limit";
import { AppError } from "../lib/app-error";
import { env } from "../env";

/** Public lead form: generous enough for a real visitor, tight enough to stop scripted spam. */
export const leadsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  // The integration suite fires many POSTs from one IP in seconds; only
  // real traffic (dev/production) should be throttled.
  skip: () => env.NODE_ENV === "test",
  handler: (_req, _res, next) => {
    next(AppError.tooManyRequests("Too many submissions. Please try again later."));
  },
});
