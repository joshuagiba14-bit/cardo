/**
 * Site-wide sign-in gate: blocks every route (including /admin) behind a
 * single owner-only login, for a private pre-launch Vercel preview. This is
 * separate from — and sits in front of — the /admin panel's own per-staff
 * auth system.
 */
export const GATE_COOKIE_NAME = "cardo_gate";
export const GATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function isGateSessionValid(cookieValue: string | undefined): boolean {
  const expected = process.env.SITE_GATE_TOKEN;
  if (!expected || !cookieValue) return false;
  return cookieValue === expected;
}

export function checkGateCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.SITE_GATE_EMAIL;
  const expectedPassword = process.env.SITE_GATE_PASSWORD;
  if (!expectedEmail || !expectedPassword) return false;

  return (
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    password === expectedPassword
  );
}
