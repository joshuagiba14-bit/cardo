/**
 * Every API response follows one of these two shapes. The frontend's
 * `apiFetch` helper narrows on `ok` to get typed access to `data` or `error`.
 */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFieldError {
  path: string;
  message: string;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
    fields?: ApiFieldError[];
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedData<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
