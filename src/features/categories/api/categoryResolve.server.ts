import { API } from "@/shared/constants/apiRoutes";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { getServerApiOrigin } from "@/shared/api/serverOrigin";
import { canonicalUrl } from "@/shared/seo/canonical";
import type { Metadata } from "next";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import type {
  CategoryBreadcrumbTrail,
  ResolvedCategorySeo,
} from "../types/categorySeo.types";

/**
 * Server-side category resolution for route metadata and JSON-LD (Rule 12:
 * network I/O lives in api modules, called from server route composition).
 */
export async function resolveCategoryBySlugServer(
  slugPath: string[],
): Promise<ResolvedCategorySeo | null> {
  try {
    const path = slugPath.join("/");
    const res = await fetch(
      `${getServerApiOrigin()}${API.categories.resolve(path)}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 120 },
      },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      success: boolean;
      data: ResolvedCategorySeo;
    };
    return body.success ? body.data : null;
  } catch (error) {
    // Unreachable category service must fall back to 404 metadata, not crash SSR.
    console.error("resolveCategoryBySlugServer failed", error);
    return null;
  }
}

export function hasFilterOrSortParams(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  return Object.keys(searchParams).some(
    (key) => key !== undefined && key.length > 0,
  );
}

/** Maps a resolved category into the trail used by breadcrumbs + JSON-LD. */
export function buildCategoryBreadcrumbTrail(
  category: ResolvedCategorySeo,
): CategoryBreadcrumbTrail {
  return [
    { name: LABELS.categoryBreadcrumbHome, href: canonicalUrl(PATHS.home) },
    ...(category.breadcrumb ?? []).map((node, index) => {
      const slugs = (category.breadcrumb ?? [])
        .slice(0, index + 1)
        .map((item) => item.slug);
      return {
        name: node.name,
        href: canonicalUrl(PATHS.category(...slugs)),
      };
    }),
  ];
}

export function toCategoryMetadataInput(
  category: ResolvedCategorySeo,
  fallbackSlugs: string[],
): ResolvedCategorySeo & {
  pathSlugs: string[];
  breadcrumbs: CategoryBreadcrumbTrail;
} {
  return {
    ...category,
    pathSlugs: category.path?.split("/").filter(Boolean) ?? fallbackSlugs,
    breadcrumbs: buildCategoryBreadcrumbTrail(category),
  };
}

export function categoryNotFoundMetadata(): Metadata {
  return generateNoIndexMetadata(LABELS.categoryNotFound);
}
