import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkGateCredentials,
  GATE_COOKIE_MAX_AGE_SECONDS,
  GATE_COOKIE_NAME,
} from "@/lib/gate";

const bodySchema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  if (!checkGateCredentials(email, password)) {
    // Small deliberate delay to slow down naive brute-forcing.
    await sleep(500);
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE_NAME, process.env.SITE_GATE_TOKEN as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
