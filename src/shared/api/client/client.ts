import {
  request,
  requestWithResponse,
  type RequestConfig,
} from "./internal/httpRequest";

export const apiClient = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, {}, config),
  getWithResponse: <T>(path: string) => requestWithResponse<T>(path),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
      ...init,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
