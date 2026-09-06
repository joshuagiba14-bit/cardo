import type { Response } from "express";
import type { ApiSuccess, PaginatedData } from "@cardo/shared";

export function sendOk<T>(res: Response, data: T, status = 200) {
  const body: ApiSuccess<T> = { ok: true, data };
  return res.status(status).json(body);
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedData<T> {
  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
