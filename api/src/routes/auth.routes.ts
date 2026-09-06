import { Router } from "express";
import bcrypt from "bcryptjs";
import { loginSchema, type AuthUserDTO } from "@cardo/shared";
import { prisma } from "../lib/prisma";
import { validateBody } from "../middleware/validate";
import { sendOk } from "../utils/http";
import { AppError } from "../lib/app-error";
import { AUTH_COOKIE_NAME, signAuthToken } from "../lib/jwt";
import { requireAuth } from "../middleware/auth";
import { env } from "../env";

export const authRouter = Router();

const COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const token = signAuthToken({ sub: user.id, email: user.email, role: user.role });

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_MS,
      path: "/",
    });

    const authUser: AuthUserDTO = { id: user.id, email: user.email, role: user.role };
    sendOk(res, authUser);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
  sendOk(res, { loggedOut: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const authUser: AuthUserDTO = {
    id: req.user!.sub,
    email: req.user!.email,
    role: req.user!.role,
  };
  sendOk(res, authUser);
});
