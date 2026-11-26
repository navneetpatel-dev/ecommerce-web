/**
 * Revenue figures are `null` (and the revenue rankings empty) for admins without `analytics.revenue`;
 * the order counts and operational numbers are always present.
 */
export interface AdminAnalytics {
  gmv: number | null;
  paidGmv: number | null;
  aov: number | null;
  totalOrders: number;
  totalCustomers: number;
  totalVendors: number;
  cancellationRate: number;
  returnRate: number;
  pendingProducts: number;
  pendingVendors: number;
  pendingReviews: number;
  ordersGrowthPct: number;
  revenueGrowthPct: number | null;
  /** `sharePercent` is the row's share of platform-wide revenue, computed server-side. */
  topVendors: {
    id: string;
    businessName: string;
    revenue: number;
    sharePercent: number;
  }[];
  topCategories: {
    id: string;
    name: string;
    revenue: number;
    sharePercent: number;
  }[];
  orderVolume: { date: string; count: number; revenue: number | null }[];
  ordersByStatus: { status: string; count: number }[];
  paymentsByStatus: { status: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
}
