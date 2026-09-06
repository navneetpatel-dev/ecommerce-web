export interface VendorInfo {
  id: string;
  businessName: string;
  slug: string;
  logoUrl: string | null;
  entityType?: string | null;
  categoryIds?: string[];
  kycComplete?: boolean;
  status?: string;
  performanceScore?: number | null;
  returnShippingFee?: number | null;
  codEnabled?: boolean;
  /** Per-vendor commission override (%). Used when the vendor's category has no rate of its own. */
  commissionRate?: number | null;
  gstNumber?: string | null;
  state?: string | null;
  /** Vendor's preferred payout cadence — reference only; payout batches are still admin-triggered manually. */
  payoutFrequency?: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | null;
}

export interface VendorDetail extends VendorInfo {
  description?: string | null;
  bannerUrl?: string | null;
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
  topProducts: {
    id: string;
    name: string;
    unitsSold: number;
    revenue: number;
  }[];
  fulfillmentSLA: { onTimePercent: number; latePercent: number };
}
