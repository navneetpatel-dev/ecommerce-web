import { describe, expect, it, vi } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import type { AdminAnalytics } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { AdminAnalyticsLayout } from "../AdminAnalyticsLayout.component";
import { useAdminAnalyticsLayout } from "../../../hooks/analytics/useAdminAnalyticsLayout.hook";
import {
  formatRevenueTick,
  isTrendEmpty,
} from "../../../utils/analytics/analyticsFormat";

// The charts and the export bar need providers; only their presence matters here.
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("../AdminAnalyticsExportBar.component", () => ({
  AdminAnalyticsExportBar: () => <div>EXPORT_BAR</div>,
}));

const withRevenue: AdminAnalytics = {
  gmv: 125000,
  paidGmv: 98000,
  aov: 1250,
  totalOrders: 100,
  totalCustomers: 40,
  totalVendors: 8,
  cancellationRate: 4,
  returnRate: 2,
  pendingProducts: 3,
  pendingVendors: 1,
  pendingReviews: 2,
  ordersGrowthPct: 5,
  revenueGrowthPct: 12,
  topVendors: [
    {
      id: "v1",
      businessName: "Acme Traders",
      revenue: 50000,
      sharePercent: 40,
    },
  ],
  topCategories: [
    { id: "c1", name: "Shirts", revenue: 30000, sharePercent: 24 },
  ],
  orderVolume: [{ date: "2026-11-25", count: 3, revenue: 4000 }],
  ordersByStatus: [{ status: "DELIVERED", count: 10 }],
  paymentsByStatus: [{ status: "PAID", count: 10 }],
  ratingDistribution: [{ rating: 5, count: 4 }],
};

describe("useAdminAnalyticsLayout revenue", () => {
  it("exposes the revenue figures", () => {
    const { result } = renderHook(() => useAdminAnalyticsLayout(withRevenue));
    expect(result.current.revenue).toEqual({
      gmv: 125000,
      paidGmv: 98000,
      aov: 1250,
      growthPct: 12,
    });
  });
});

describe("AdminAnalyticsLayout", () => {
  it("shows GMV, paid GMV, AOV, the rankings and the export bar", () => {
    render(<AdminAnalyticsLayout data={withRevenue} />);
    expect(screen.getByText(LABELS.analyticsGmv)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsPaidGmv)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsAov)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsTopVendors)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsTopCategories)).toBeInTheDocument();
    expect(screen.getByText("EXPORT_BAR")).toBeInTheDocument();
  });
});

describe("trend helpers", () => {
  it("is empty only when there are neither orders nor revenue", () => {
    expect(isTrendEmpty([{ count: 2, revenue: 0 }])).toBe(false);
    expect(isTrendEmpty([{ count: 0, revenue: 5 }])).toBe(false);
    expect(isTrendEmpty([{ count: 0, revenue: 0 }])).toBe(true);
  });

  it("formats compact revenue ticks", () => {
    expect(formatRevenueTick(500)).toBe("500");
    expect(formatRevenueTick(1500)).toBe("2k");
    expect(formatRevenueTick(250000)).toBe("3L");
  });
});
