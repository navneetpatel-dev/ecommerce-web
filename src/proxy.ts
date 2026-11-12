import { NextResponse, type NextRequest } from "next/server";
import { SERVER_API_ORIGIN } from "@/shared/config/appConfig";
import { getArticleBySlug } from "@/features/help/utils/search/helpSearch.utils";
import { getBlogPost } from "@/features/content/constants/site/siteContent";

/**
 * Runs before rendering, which is the only point a page can still answer with a
 * real status: every storefront route streams behind a loading.tsx, and once the
 * stream starts the status is fixed at 200 (Next docs, loading.js "Status codes").
 *
 * 1. Maintenance mode (B-11): while an admin has it on, storefront pages show
 *    /maintenance with 503. Admin, seller and sign-in pages stay reachable.
 * 2. Real 404s (B-20, B-27): a full page load of a product, category, shop, help
 *    article or blog post that does not exist answers 404 instead of a "not found"
 *    page with 200. Client-side navigations skip the check (status does not matter
 *    there), so browsing stays as fast as before.
 */

const MAINTENANCE_EXEMPT = [
  /^\/maintenance/,
  /^\/unsubscribe/,
  /^\/admin/,
  /^\/vendor/,
  /^\/login/,
  /^\/otp/,
  /^\/auth\//,
  /^\/forgot-password/,
  /^\/reset-password/,
  /^\/offline/,
];
const SETTINGS_TTL_MS = 30_000;
let settingsCache: { at: number; maintenance: boolean } | null = null;

async function maintenanceOn(): Promise<boolean> {
  if (settingsCache && Date.now() - settingsCache.at < SETTINGS_TTL_MS)
    return settingsCache.maintenance;
  try {
    const res = await fetch(`${SERVER_API_ORIGIN}/api/settings/public`, {
      cache: "no-store",
    });
    const body = (await res.json()) as {
      data?: { maintenanceEnabled?: boolean };
    };
    settingsCache = {
      at: Date.now(),
      maintenance: Boolean(body.data?.maintenanceEnabled),
    };
  } catch {
    // Settings unreachable: keep serving the store rather than lock everyone out.
    settingsCache = { at: Date.now(), maintenance: false };
  }
  return settingsCache.maintenance;
}

function isDocumentRequest(request: NextRequest): boolean {
  if (request.method !== "GET") return false;
  if (request.headers.get("rsc") || request.headers.get("next-router-prefetch"))
    return false;
  return (request.headers.get("accept") ?? "").includes("text/html");
}

async function apiSaysMissing(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${SERVER_API_ORIGIN}${path}`, {
      cache: "no-store",
    });
    return res.status === 404;
  } catch {
    return false; // Backend down: let the page render its own error state.
  }
}

/** Whether a full page load points at content that does not exist. */
async function isMissing(pathname: string): Promise<boolean> {
  const [, section, ...rest] = pathname.split("/");
  const slug = decodeURIComponent(rest.join("/"));
  if (!slug) return false;
  switch (section) {
    case "products":
      return (
        rest.length === 1 &&
        apiSaysMissing(`/api/products/slug/${encodeURIComponent(slug)}`)
      );
    case "category":
      return apiSaysMissing(
        `/api/categories/resolve?path=${encodeURIComponent(slug)}`,
      );
    case "vendors":
      return (
        rest.length === 1 &&
        apiSaysMissing(`/api/vendors/slug/${encodeURIComponent(slug)}`)
      );
    case "help":
      return rest.length === 1 && !getArticleBySlug(slug);
    case "blog":
      return rest.length === 1 && !getBlogPost(slug);
    default:
      return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    !MAINTENANCE_EXEMPT.some((pattern) => pattern.test(pathname)) &&
    (await maintenanceOn())
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
      headers: { "Retry-After": "600" },
    });
  }

  if (isDocumentRequest(request) && (await isMissing(pathname))) {
    // Any path no route matches renders the not-found page with a real 404.
    return NextResponse.rewrite(new URL("/__not-found", request.url), {
      status: 404,
    });
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: not the API rewrite, Next's own files, or static assets.
  matcher: [
    "/((?!api/|_next/|favicon|icons/|images/|sw\\.js|manifest|robots\\.txt|sitemap).*)",
  ],
};
