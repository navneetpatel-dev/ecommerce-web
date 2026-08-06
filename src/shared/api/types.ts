export type RoleName = 'CUSTOMER' | 'VENDOR_OWNER' | 'VENDOR_STAFF' | 'SUPER_ADMIN' | 'ADMIN_STAFF' | 'SUPPORT_STAFF';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: RoleName;
  vendorId: string | null;
  emailVerified: boolean;
}

export interface VendorInfo {
  id: string;
  businessName: string;
  slug: string;
  logoUrl: string | null;
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
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
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED';
  estimatedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  vendor: VendorInfo;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  subtotal: number;
  shippingCost?: number;
  items: OrderItem[];
  shipment?: Shipment | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  discountTotal: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  user?: { name: string };
}

export interface WishlistItem {
  id: string;
  productId: string;
  priceAtAdd: number;
  product: ProductListItem;
}

export interface ShippingRate {
  method: 'STANDARD' | 'EXPRESS';
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
  status: 'PENDING' | 'SETTLED' | 'CLAWED_BACK';
  createdAt: string;
}

export interface PayoutEntry {
  id: string;
  vendorId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';
  paidAt: string | null;
}

export interface WalletLedgerEntry {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  referenceType: string;
  description: string;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  subOrderId: string;
  orderItemId: string;
  reason: string;
  reasonCode: 'DAMAGED' | 'WRONG_ITEM' | 'NOT_AS_DESCRIBED' | 'NO_LONGER_NEEDED' | 'OTHER';
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'PICKUP_SCHEDULED' | 'RECEIVED' | 'REFUNDED' | 'CLOSED';
  refundAmount: number | null;
  createdAt: string;
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
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'LIVE' | 'REJECTED' | 'ARCHIVED';
  lowStockAt: number;
}

export interface VendorSummary {
  todayOrders: number;
  pendingShipments: number;
  monthRevenue: number;
  walletBalance: number;
}

export interface VendorAnalytics {
  revenue: { date: string; amount: number }[];
  topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
  fulfillmentSLA: { onTimePercent: number; latePercent: number };
}

export interface AdminAnalytics {
  gmv: number;
  topVendors: { id: string; businessName: string; revenue: number }[];
  topCategories: { id: string; name: string; revenue: number }[];
  orderVolume: { date: string; count: number }[];
}

export interface PlatformSettings {
  defaultCommissionRate: number;
  autoApproveProducts: boolean;
  defaultReturnWindow: number;
  payoutCycle: string;
}
