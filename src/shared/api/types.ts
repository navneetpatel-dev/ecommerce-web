import type {
  CommissionStatus,
  OrderStatus,
  PaymentStatus,
  PayoutStatus,
  ProductStatus,
  ReturnReason,
  ReturnStatus,
  ReviewStatus,
  ShipmentStatus,
  ShippingMethod,
  UnavailableReason,
} from '@/shared/constants/statuses'
import type { RoleName } from '@/shared/constants/labels'

export type { RoleName };

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: RoleName;
  status?: string | null;
  permissions?: string[];
  vendorId: string | null;
  emailVerified: boolean;
  emailMarketingConsent?: boolean;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface VendorInfo {
  id: string;
  businessName: string;
  slug: string;
  logoUrl: string | null;
}

export interface VendorDetail extends VendorInfo {
  description?: string | null;
  bannerUrl?: string | null;
}

export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  compareAtPrice?: number;
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
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  variants: ProductVariant[];
  images: ProductImage[];
  categoryId: string;
  status: string;
  secondaryCategories?: Array<{ id: string; name: string; slug: string; status?: string }>;
}

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
  type: 'ENUM' | 'RANGE' | 'BOOLEAN';
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

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    vendor: VendorInfo;
  };
  variant: {
    sku: string;
    attributes: Record<string, string>;
    weightGrams?: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  variantId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Shipment {
  id: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
  status: ShipmentStatus;
  estimatedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  vendor: VendorInfo;
  status: OrderStatus;
  subtotal: number;
  shippingCost?: number;
  taxAmount?: number;
  items: OrderItem[];
  shipment?: Shipment | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  discountTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  subOrders: SubOrder[];
  shippingAddress?: Address | null;
}

export interface Address {
  id: string;
  userId: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderItemId: string;
  rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  user?: { name: string };
  product?: { id: string; name: string; slug: string };
}

export interface AuthSession {
  id: string;
  family: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  isCurrent: boolean;
}

export interface ReturnRequest {
  id: string;
  subOrderId: string;
  orderItemId: string;
  userId: string;
  reason: string;
  reasonCode: ReturnReason;
  status: ReturnStatus;
  refundAmount: number | null;
  resolvedAt: string | null;
  createdAt: string;
  productName: string | null;
}

export interface WishlistItem {
  id: string;
  productId: string;
  priceAtAdd: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  product: ProductListItem;
}

export interface ShippingRate {
  method: ShippingMethod;
  cost: number;
  estimatedDays: number;
}

export interface VendorBreakdown {
  vendorId: string;
  vendor: VendorInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: { cgst: number; sgst: number; igst: number; total: number };
  discount: number;
  total: number;
}

export interface CheckoutQuote {
  vendorBreakdowns: VendorBreakdown[];
  grandTotal: number;
  appliedCoupon: { code: string; discount: number } | null;
}

export interface CommissionLedgerEntry {
  id: string;
  vendorId: string;
  subOrderId: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
}

export interface PayoutEntry {
  id: string;
  vendorId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  paidAt: string | null;
}

export type CouponType = 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING' | 'BOGO' | 'TIERED' | 'CASHBACK' | 'BUNDLE';
export type CouponStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number | null;
  maxDiscountCap: number | null;
  minOrderValue: number | null;
  minQuantity: number | null;
  applicableScope: Record<string, unknown>;
  usageLimitTotal: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  stackable: boolean;
  priority: number;
  status: CouponStatus;
  vendorId: string | null;
}

export interface VendorProduct extends ProductListItem {
  sku: string;
  status: ProductStatus;
  lowStockAt: number;
}

export interface VendorSummary {
  todayOrders: number;
  pendingShipments: number;
  monthRevenue: number;
  pendingPayouts: number;
  performanceScore?: number | null;
}

export interface VendorAnalytics {
  revenue: { date: string; amount: number }[];
  topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
  fulfillmentSLA: { onTimePercent: number; latePercent: number };
}

export interface AdminAnalytics {
  gmv: number;
  paidGmv: number;
  aov: number;
  totalOrders: number;
  totalCustomers: number;
  totalVendors: number;
  cancellationRate: number;
  returnRate: number;
  pendingProducts: number;
  pendingVendors: number;
  pendingReviews: number;
  ordersGrowthPct: number;
  revenueGrowthPct: number;
  topVendors: { id: string; businessName: string; revenue: number }[];
  topCategories: { id: string; name: string; revenue: number }[];
  orderVolume: { date: string; count: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  paymentsByStatus: { status: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
}

export interface PlatformSettings {
  defaultCommissionRate: number;
  autoApproveProducts: boolean;
  defaultReturnWindow: number;
  payoutCycle: string;
  freeShippingThreshold: number;
  supportEmail: string;
  supportHours: string;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  imageSrc: string;
  imageMobileSrc?: string | null;
  imageAlt: string;
}
