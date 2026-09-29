import { API } from "@/shared/constants/apiRoutes";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { getServerApiOrigin } from "@/shared/api/client/serverOrigin";
import type { SeoFetchEntry } from "@/shared/seo/fetchSeoApi";
import type { VendorDetail } from "@/shared/api/types";

/**
 * Server-side vendor resolution for route metadata (Rule 12: network I/O in
 * api modules; Rule 27: dynamic metadata from the fetched entity).
 *
 * Keeps the reason a vendor is absent so the storefront can 404 a slug that
 * does not exist while still rendering during an API outage — a vendor page
 * without this distinction answered 200 for every `/vendors/<anything>`.
 */
export async function resolveVendorSeoEntry(
  slug: string,
): Promise<SeoFetchEntry<VendorDetail>> {
  try {
    const res = await fetch(
      `${getServerApiOrigin()}${API.vendors.bySlug(slug)}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 120 },
      },
    );
    if (res.status === 404) return { status: "missing" };
    if (!res.ok) return { status: "unavailable" };

    const body = (await res.json()) as {
      success: boolean;
      data: VendorDetail;
      error?: { code?: string };
    };
    if (!body.success) {
      return body.error?.code === ERROR_CODES.NOT_FOUND
        ? { status: "missing" }
        : { status: "unavailable" };
    }
    return { status: "found", data: body.data };
  } catch (error) {
    // Unreachable vendor service falls back to default metadata, not SSR crash.
    console.error("resolveVendorSeoEntry failed", error);
    return { status: "unavailable" };
  }
}

/** Metadata helper: missing and unavailable both yield null. */
export async function resolveVendorBySlugServer(
  slug: string,
): Promise<VendorDetail | null> {
  const entry = await resolveVendorSeoEntry(slug);
  return entry.status === "found" ? entry.data : null;
}
