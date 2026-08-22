import { API } from "@/shared/constants/apiRoutes";
import { getServerApiOrigin } from "@/shared/api/serverOrigin";
import type { VendorDetail } from "@/shared/api/types";

/**
 * Server-side vendor resolution for route metadata (Rule 12: network I/O in
 * api modules; Rule 27: dynamic metadata from the fetched entity).
 */
export async function resolveVendorBySlugServer(
  slug: string,
): Promise<VendorDetail | null> {
  try {
    const res = await fetch(
      `${getServerApiOrigin()}${API.vendors.bySlug(slug)}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 120 },
      },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      success: boolean;
      data: VendorDetail;
    };
    return body.success ? body.data : null;
  } catch (error) {
    // Unreachable vendor service falls back to default metadata, not SSR crash.
    console.error("resolveVendorBySlugServer failed", error);
    return null;
  }
}
