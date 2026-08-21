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
