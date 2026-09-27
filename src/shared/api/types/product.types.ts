import type { ProductStatus } from "@/shared/constants/statuses";
import type { Category } from "./category.types";
import type { VendorInfo } from "./vendor.types";

export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  /** Listed price before GST (the cart adds GST as its own line). */
  basePrice: number;
  /** What the customer pays for one piece, GST included (API-computed); shown on cards. */
  displayPrice?: number;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  /** BE-derived — show MRP strikethrough when true. */
  showMrp?: boolean;
  /** True when variants sell at different prices: `basePrice` is the lowest ("From ₹…"). */
  hasPriceRange?: boolean;
  /** The highest variant price (API-computed). */
  priceRangeMax?: number;
  brand?: string | null;
  avgRating: number;
  reviewCount: number;
  imageUrl: string;
  stock: number;
  vendor: VendorInfo;
  isWishlisted?: boolean;
  /** Present on list payloads when the API includes variants (used for quick-add). */
  variants?: Array<{ id: string; stock?: number }>;
  categoryId?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  lowStockAt: number;
  weightGrams?: number;
  codEligibleAtUnitPrice?: boolean;
  /** This variant's price with GST (API-computed on the product page). */
  displayPrice?: number;
  /** This variant's "% off" against the product's MRP (API-computed); null when none. */
  discountPercent?: number | null;
  /** Whether this variant is priced below the MRP, so the MRP is shown struck through. */
  showMrp?: boolean;
  /** This variant's price with GST, for tax-inclusive products (API-computed). */
  taxInclusivePrice?: number | null;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  variantId?: string | null;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  specs?: Record<string, string>;
  highlights?: string[];
  tags?: string[];
  deliveryNote?: string | null;
  returnNote?: string | null;
  vendorFreeShippingThreshold?: number | null;
  categoryName?: string | null;
  category?: Category | null;
  variants: ProductVariant[];
  images: ProductImage[];
  categoryId: string;
  status: string;
  secondaryCategories?: Array<{
    id: string;
    name: string;
    slug: string;
    status?: string;
  }>;
  warrantyMonths?: number | null;
  warrantyType?: string | null;
  hsnCode?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  videoUrl?: string | null;
  sizeChartUrl?: string | null;
  /** Stored product flag: null inherits category and seller. */
  codEnabled?: boolean | null;
  returnsAllowed?: boolean;
  returnWindowDays?: number | null;
  returnShippingFee?: number;
  gstPercentage?: number;
  displayHsnCode?: string | null;
  taxInclusive?: boolean;
  taxInclusivePrice?: number | null;
  codAvailable?: boolean;
  /** Unit price meets COD min/max at PDP — checkout `codAvailable` uses cart grand total. */
  codEligibleAtUnitPrice?: boolean;
  codMinOrderValue?: number;
  codMaxOrderValue?: number | null;
  displayWarrantyMonths?: number | null;
  displayWarrantyType?: string | null;
  vendorPerformanceScore?: number | null;
}

export interface VendorProduct extends ProductListItem {
  sku: string;
  status: ProductStatus;
  lowStockAt: number;
}
