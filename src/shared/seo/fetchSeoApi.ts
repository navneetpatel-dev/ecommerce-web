import { getServerApiOrigin } from "@/shared/api/client/serverOrigin";

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
