import { SITE } from "@/shared/seo/constants";
import { getProductSeoEntry } from "@/shared/seo/data";

export interface ShortLinkData {
  code: string;
  targetUrl: string;
  shortUrl: string;
  resourceType: string;
  resourceId?: string;
  metadata?: {
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    currency?: string;
    brand?: string;
  } | null;
}

export async function fetchShortLink(
  code: string,
): Promise<ShortLinkData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
  try {
    const res = await fetch(
      `${apiUrl}/api/short-links/${encodeURIComponent(code)}`,
      {
        cache: "no-store",
      },
    );
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data as ShortLinkData;
    }
  } catch {
    // Backend unreachable, fall through to product SEO lookup
  }

  const entry = await getProductSeoEntry(code);
  if (entry.status === "found") {
    const prod = entry.data;
    return {
      code,
      targetUrl: `/products/${prod.slug}`,
      shortUrl: `${SITE.url}/s/${code}`,
      resourceType: "PRODUCT",
      metadata: {
        name: prod.name,
        description: prod.description,
        imageUrl: prod.imageUrl,
        price: prod.price,
        currency: prod.currency,
      },
    };
  }

  return null;
}
