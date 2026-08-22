import type { BreadcrumbItem } from "@/shared/seo/types";

/** A breadcrumb node as returned by the category resolve endpoint. */
export interface CategoryBreadcrumbNode {
  id: string;
  name: string;
  slug: string;
}

/** Resolved category payload used for route metadata and JSON-LD. */
export interface ResolvedCategorySeo {
  id: string;
  name: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  path?: string;
  breadcrumb?: CategoryBreadcrumbNode[];
}

export type CategoryBreadcrumbTrail = BreadcrumbItem[];
