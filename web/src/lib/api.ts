import type { ApiResponse } from "@cardo/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Thin wrapper so both Server Components (offerings/case studies lists) and
 * client components (contact form, admin panel) talk to the API the same
 * way, typed against the shared ApiResponse<T> envelope.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    // Offerings/case studies are admin-editable; always fetch current data.
    cache: options.cache ?? "no-store",
  });

  const body = (await res.json()) as ApiResponse<T>;
  return body;
}
