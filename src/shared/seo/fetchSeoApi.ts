import { getServerApiOrigin } from "@/shared/api/client/serverOrigin";
import { ERROR_CODES } from "@/shared/constants/http/errors";

/**
 * Server-side SEO fetch. Returns null on any failure (network, non-2xx,
 * `success: false`) so sitemaps and metadata degrade to "no entries" instead of
 * failing a build.
 */
export async function fetchSeoApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getServerApiOrigin()}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { success: boolean; data: T };
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

/** Why a server-side SEO lookup produced nothing. */
export type SeoFetchEntry<T> =
  | { status: "found"; data: T }
  | { status: "missing" }
  | { status: "unavailable" };

/**
 * The same request as `fetchSeoApi`, except it keeps the reason it found
 * nothing. A 404 — or an envelope carrying `NOT_FOUND` — means the entity
 * genuinely does not exist, so the route may answer with a real 404. A network
 * error, a 5xx or an unrecognised envelope means the backend is unavailable and
 * the route must keep rendering. Collapsing the two (as `fetchSeoApi` does, for
 * sitemaps that must never fail a build) is what made every unknown product and
 * vendor URL an indexable soft 404.
 */
export async function fetchSeoApiEntry<T>(
  path: string,
): Promise<SeoFetchEntry<T>> {
  try {
    const res = await fetch(`${getServerApiOrigin()}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });
    if (res.status === 404) return { status: "missing" };
    if (!res.ok) return { status: "unavailable" };

    const body = (await res.json()) as {
      success: boolean;
      data: T;
      error?: { code?: string };
    };
    if (!body.success) {
      return body.error?.code === ERROR_CODES.NOT_FOUND
        ? { status: "missing" }
        : { status: "unavailable" };
    }
    return { status: "found", data: body.data };
  } catch {
    return { status: "unavailable" };
  }
}
