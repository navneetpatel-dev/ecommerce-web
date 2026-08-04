import { useAuthStore } from '@/features/auth/store/auth.store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessTokenAndRetry(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) {
        useAuthStore.getState().clearSession();
        return false;
      }
      const body = (await res.json()) as ApiSuccess<{ accessToken: string; user: unknown }>;
      if (body.success) {
        useAuthStore.getState().setAccessToken(body.data.accessToken);
        return true;
      }
      return false;
    })
    .catch(() => {
      useAuthStore.getState().clearSession();
      return false;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessTokenAndRetry();
    if (refreshed) {
      return request<T>(path, options);
    }
    throw new ApiError('UNAUTHORIZED', 'Session expired. Please log in again.');
  }

  const body = (await res.json()) as ApiSuccess<T> | ApiFailure;
  if (!body.success) {
    throw new ApiError(body.error.code, body.error.message, body.error.details);
  }
  return body.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiError };
