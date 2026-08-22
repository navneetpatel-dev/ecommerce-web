import type { BreadcrumbItem, ProductSeoData, CategorySeoData } from "./types";
import { canonicalUrl } from "./canonical";
import { API } from "@/shared/constants/apiRoutes";
import { PATHS } from "@/shared/constants/paths";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { getServerApiOrigin } from "@/shared/api/serverOrigin";
import { LABELS } from "@/shared/constants/labels";

async function fetchApi<T>(path: string): Promise<T | null> {
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

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  basePrice: number;
  avgRating: number;
  reviewCount: number;
  stock: number;
  imageUrl: string;
  tags: string[];
  vendor: { businessName: string };
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    parent?: BackendProduct["category"] | null;
  } | null;
}

interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: BackendCategory[];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductSeoData | null> {
  const product = await fetchApi<BackendProduct>(API.products.bySlug(slug));
  if (!product) return null;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: LABELS.categoryBreadcrumbHome, href: canonicalUrl(PATHS.home) },
  ];
  if (product.category) {
    const chain: Array<{ name: string; slug: string }> = [];
    let cursor: BackendProduct["category"] | null | undefined =
      product.category;
    while (cursor) {
      chain.unshift({ name: cursor.name, slug: cursor.slug });
      cursor = cursor.parent ?? null;
    }
    chain.forEach((node, index) => {
      const slugs = chain.slice(0, index + 1).map((item) => item.slug);
      breadcrumbs.push({
        name: node.name,
        href: canonicalUrl(PATHS.category(...slugs)),
      });
    });
  }
  breadcrumbs.push({ name: product.name, href: "" });

  return {
    name: product.name,
    description: product.description || "",
    seoTitle: product.seoTitle ?? null,
    seoDescription: product.seoDescription ?? null,
    slug: product.slug,
    imageUrl: product.imageUrl || "",
    basePrice: product.basePrice,
    currency: "INR",
    avgRating: product.avgRating || 0,
    reviewCount: product.reviewCount || 0,
    stock: product.stock || 0,
    category: {
      name: product.category?.name || "",
      slug: product.category?.slug || "",
      breadcrumbs,
    },
    vendor: {
      businessName: product.vendor?.businessName || "",
    },
    tags: product.tags || [],
  };
}

export async function getCategories(): Promise<CategorySeoData[]> {
  const categories = await fetchApi<BackendCategory[]>(API.categories.list);
  if (!categories) return [];
  return categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    breadcrumbs: [
      { name: LABELS.categoryBreadcrumbHome, href: canonicalUrl(PATHS.home) },
      { name: cat.name, href: "" },
    ],
  }));
}

/** Page size for sitemap product enumeration — loop until a short page. */
const SITEMAP_PRODUCT_PAGE_SIZE = 500;
/** Hard stop so an unbounded catalog cannot hang the sitemap build. */
const SITEMAP_MAX_PRODUCTS = 50_000;

export async function getLiveProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  for (
    let offset = 0;
    offset < SITEMAP_MAX_PRODUCTS;
    offset += SITEMAP_PRODUCT_PAGE_SIZE
  ) {
    const data = await fetchApi<{ items: BackendProduct[] }>(
      API.products.list(
        `status=${PRODUCT_STATUS.LIVE}&limit=${SITEMAP_PRODUCT_PAGE_SIZE}&offset=${offset}`,
      ),
    );
    if (!data?.items?.length) break;
    slugs.push(...data.items.map((p) => p.slug));
    if (data.items.length < SITEMAP_PRODUCT_PAGE_SIZE) break;
  }
  return slugs;
}

export async function getCategorySlugs(): Promise<
  { name: string; slug: string }[]
> {
  const categories = await fetchApi<BackendCategory[]>(API.categories.list);
  if (!categories) return [];

  const result: { name: string; slug: string }[] = [];
  function collect(cats: BackendCategory[]) {
    for (const cat of cats) {
      result.push({ name: cat.name, slug: cat.slug });
      if (cat.children) collect(cat.children);
    }
  }
  collect(categories);
  return result;
}
