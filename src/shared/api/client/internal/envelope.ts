import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/http/errors";
import { ApiError } from "@/shared/types/apiError.types";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

export async function parseResponseBody(
  res: Response,
): Promise<ApiSuccess<unknown> | ApiFailure | null> {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as ApiSuccess<unknown> | ApiFailure;
  } catch {
    if (res.status === 429) {
      throw new ApiError(
        ERROR_CODES.RATE_LIMITED,
        text.trim().slice(0, 160) || ERROR_MESSAGES.RATE_LIMITED,
      );
    }
    throw new ApiError(
      ERROR_CODES.INVALID_RESPONSE,
      text.trim().slice(0, 160) || `Unexpected response (${res.status})`,
    );
  }
}

export function assertSuccess<T>(
  body: ApiSuccess<unknown> | ApiFailure | null,
  status: number,
): T {
  if (!body) {
    throw new ApiError(
      ERROR_CODES.EMPTY_RESPONSE,
      `Empty response (${status})`,
    );
  }
  if (!("success" in body) || !body.success) {
    const failure = body as ApiFailure;
    throw new ApiError(
      failure.error?.code ?? ERROR_CODES.REQUEST_FAILED,
      failure.error?.message ?? `Request failed (${status})`,
      failure.error?.details,
    );
  }
  return body.data as T;
}
