import type { BackendCategory } from "./types";
import { fetchSeoApi } from "./fetchSeoApi";
import { API } from "@/shared/constants/apiRoutes";

/**
 * Sitemap-only enumerations, split out of `data.ts` so each stays under the
 * per-file line ceiling. Both degrade to an empty list when the API is down.
 */

/**
 * Every category as a full slug path (`["clothing", "sarees"]`), which is how
 * its canonical URL is built — a bare slug list would produce wrong URLs for
 * nested categories, so the sitemap needs the chain, not just the leaf.
 */
export async function getCategoryPaths(): Promise<string[][]> {
  const categories = await fetchSeoApi<BackendCategory[]>(API.categories.list);
  if (!categories) return [];

  const paths: string[][] = [];
  function collect(cats: BackendCategory[], prefix: string[]) {
    for (const cat of cats) {
      const path = [...prefix, cat.slug];
      paths.push(path);
      if (cat.children?.length) collect(cat.children, path);
    }
  }
  collect(categories, []);
  return paths;
}

/** Page size for sitemap vendor enumeration — loop until a short page. */
const SITEMAP_VENDOR_PAGE_SIZE = 200;
/** Hard stop so an unbounded vendor list cannot hang the sitemap build. */
const SITEMAP_MAX_VENDORS = 5_000;

export async function getLiveVendorSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  for (let page = 1; slugs.length < SITEMAP_MAX_VENDORS; page += 1) {
    const data = await fetchSeoApi<{ items: Array<{ slug: string }> }>(
      API.vendors.storefront(`page=${page}&limit=${SITEMAP_VENDOR_PAGE_SIZE}`),
    );
    if (!data?.items?.length) break;
    slugs.push(...data.items.map((vendor) => vendor.slug));
    if (data.items.length < SITEMAP_VENDOR_PAGE_SIZE) break;
  }
  return slugs;
}
