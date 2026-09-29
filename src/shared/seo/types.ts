export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface ProductSeoData {
  name: string;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  slug: string;
  imageUrl: string;
  /** What the customer pays for one piece, GST included. */
  price: number;
  currency: string;
  avgRating: number;
  reviewCount: number;
  stock: number;
  category: {
    name: string;
    slug: string;
    breadcrumbs: BreadcrumbItem[];
  };
  vendor: {
    businessName: string;
  };
  tags: string[];
}

export interface CategorySeoData {
  name: string;
  slug: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface FaqQuestion {
  question: string;
  answer: string;
}

/** Category node as the catalog API returns it (seo helpers pick fields out). */
export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: BackendCategory[];
}
