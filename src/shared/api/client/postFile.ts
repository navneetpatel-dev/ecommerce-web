import { getApiSessionAdapter } from "./sessionAdapter";
import { BEARER_PREFIX } from "@/shared/constants/http/http";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES } from "@/shared/constants/http/errors";

/**
 * Multipart file upload — bypasses JSON Content-Type headers for multipart boundary.
 */
export async function postFile<T>(path: string, file: File): Promise<T> {
  const token = getApiSessionAdapter().getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : undefined,
    body: formData,
  });

  const text = await res.text();
  let body: {
    success?: boolean;
    error?: { code?: string; message?: string };
    data?: T;
  } | null = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(
      body?.error?.code ?? ERROR_CODES.INVALID_RESPONSE,
      body?.error?.message ?? `Request failed with status ${res.status}`,
    );
  }

  return body.data as T;
}
