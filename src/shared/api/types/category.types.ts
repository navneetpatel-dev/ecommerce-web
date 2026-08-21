export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl?: string | null;
  status?: string;
  displayOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  commissionRate?: number | null;
  returnWindowDays?: number | null;
  codEnabled?: boolean;
  defaultWarrantyMonths?: number | null;
  defaultWarrantyType?: string | null;
  parent?: { id: string; name: string; slug?: string } | null;
  children?: Category[];
  attributes?: CategoryAttribute[];
  path?: string;
  breadcrumb?: Array<{ id: string; name: string; slug: string }>;
}

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  name: string;
  type: "ENUM" | "RANGE" | "BOOLEAN";
  options: unknown[];
  displayOrder: number;
  filterKey?: string;
}

export interface CategoryFacetOption {
  value: string;
  count: number;
  disabled: boolean;
}

export interface CategoryFacet {
  id: string;
  name: string;
  filterKey: string;
  type: string;
  options: CategoryFacetOption[];
}
