export interface BreadcrumbItem {
  name: string
  href: string
}

export interface ProductSeoData {
  name: string
  description: string
  slug: string
  imageUrl: string
  basePrice: number
  currency: string
  avgRating: number
  reviewCount: number
  stock: number
  category: {
    name: string
    slug: string
    breadcrumbs: BreadcrumbItem[]
  }
  vendor: {
    businessName: string
  }
  tags: string[]
}

export interface CategorySeoData {
  name: string
  slug: string
  breadcrumbs: BreadcrumbItem[]
}

export interface FaqQuestion {
  question: string
  answer: string
}
