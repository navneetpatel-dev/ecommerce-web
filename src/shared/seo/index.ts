export { SITE } from './constants'
export type { BreadcrumbItem, ProductSeoData, CategorySeoData, FaqQuestion } from './types'
export {
  generateHomeMetadata,
  generateProductMetadata,
  generateCategoryMetadata,
  generateStaticPageMetadata,
  generateNoIndexMetadata,
} from './metadata'
export {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from './structured-data'
export { JsonLd } from './JsonLd'
export { canonicalUrl, productCanonical, categoryCanonical } from './canonical'
export { ogDefaults, productOg } from './open-graph'
export { getProductBySlug, getCategories, getLiveProductSlugs, getCategorySlugs } from './data'
