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
