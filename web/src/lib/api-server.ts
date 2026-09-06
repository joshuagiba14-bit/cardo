import { cookies } from "next/headers";
import type { ApiResponse } from "@cardo/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Server-side fetch has no browser cookie jar, so the incoming request's
 * cookies (the httpOnly session cookie included) have to be forwarded by
 * hand. Used by the admin dashboard, which is authenticated.
 */
export async function apiFetchServer<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Cookie: cookieStore.toString(),
      ...options.headers,
    },
    cache: "no-store",
  });
  return (await res.json()) as ApiResponse<T>;
}
