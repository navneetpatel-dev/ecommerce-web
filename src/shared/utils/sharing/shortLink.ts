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

const PLACEHOLDER_ORIGIN = "https://placeholder.invalid";
const UNSAFE_PATH_CHARS = /[\u0000-\u001f\u007f\\]/;

/**
 * The only thing the short-link page may navigate to: a same-site path. Anything that could leave
 * the site (`//evil.com`, `/\evil.com`, `javascript:…`, another host) becomes `/`, and the rest is
 * re-serialised as a browser reads it (so `<`, `>` and quotes are percent-encoded). The API already
 * does this; the page does not rely on it.
 */
export function safeRedirectPath(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  const candidate = value.startsWith("/") ? value : `/${value}`;
  if (
    !value ||
    candidate.startsWith("//") ||
    UNSAFE_PATH_CHARS.test(candidate) ||
    candidate.length > 2048
  ) {
    return "/";
  }
  try {
    const url = new URL(candidate, PLACEHOLDER_ORIGIN);
    if (url.origin !== PLACEHOLDER_ORIGIN) return "/";
    const path = `${url.pathname}${url.search}`;
    return path.startsWith("/") && !path.startsWith("//") ? path : "/";
  } catch {
    return "/";
  }
}

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/** A JS string literal that is safe inside an inline `<script>`: `</script>` and line separators cannot end it early. */
export function toInlineScriptString(value: string): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
