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

/** What the API returns to an admin without analytics.revenue. */
const withoutRevenue: AdminAnalytics = {
  ...withRevenue,
  gmv: null,
  paidGmv: null,
  aov: null,
  revenueGrowthPct: null,
  topVendors: [],
  topCategories: [],
  orderVolume: [{ date: "2026-11-25", count: 3, revenue: null }],
};

describe("useAdminAnalyticsLayout revenue visibility", () => {
  it("exposes the revenue figures for an admin with revenue access", () => {
    const { result } = renderHook(() => useAdminAnalyticsLayout(withRevenue));
    expect(result.current.showRevenue).toBe(true);
    expect(result.current.revenue).toEqual({
      gmv: 125000,
      paidGmv: 98000,
      aov: 1250,
      growthPct: 12,
    });
  });

  it("exposes no revenue when the API redacted it", () => {
    const { result } = renderHook(() =>
      useAdminAnalyticsLayout(withoutRevenue),
    );
    expect(result.current.showRevenue).toBe(false);
    expect(result.current.revenue).toBeNull();
  });
});

describe("AdminAnalyticsLayout", () => {
  it("shows GMV, paid GMV, AOV, the rankings and the export bar with revenue access", () => {
    render(<AdminAnalyticsLayout data={withRevenue} />);
    expect(screen.getByText(LABELS.analyticsGmv)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsPaidGmv)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsAov)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsTopVendors)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsTopCategories)).toBeInTheDocument();
    expect(screen.getByText("EXPORT_BAR")).toBeInTheDocument();
  });

  it("hides every revenue figure, ranking and the export without it, but keeps the operational numbers", () => {
    render(<AdminAnalyticsLayout data={withoutRevenue} />);
    expect(screen.queryByText(LABELS.analyticsGmv)).not.toBeInTheDocument();
    expect(screen.queryByText(LABELS.analyticsPaidGmv)).not.toBeInTheDocument();
    expect(screen.queryByText(LABELS.analyticsAov)).not.toBeInTheDocument();
    expect(
      screen.queryByText(LABELS.analyticsTopVendors),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(LABELS.analyticsTopCategories),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("EXPORT_BAR")).not.toBeInTheDocument();

    expect(screen.getByText(LABELS.analyticsTotalOrders)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsCustomers)).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsVendors)).toBeInTheDocument();
    expect(
      screen.getByText(LABELS.analyticsCancellationRate),
    ).toBeInTheDocument();
    expect(screen.getByText(LABELS.analyticsReturnRate)).toBeInTheDocument();
  });
});

describe("trend helpers", () => {
  it("only treats a day-less series as empty when revenue is hidden, ignoring revenue", () => {
    const points = [{ count: 2, revenue: 0 }];
    expect(isTrendEmpty(points, true)).toBe(false);
    expect(isTrendEmpty([{ count: 0, revenue: 0 }], true)).toBe(true);
    // Revenue hidden: only the order count decides.
    expect(isTrendEmpty([{ count: 0 }], false)).toBe(true);
    expect(isTrendEmpty([{ count: 3 }], false)).toBe(false);
  });

  it("formats compact revenue ticks", () => {
    expect(formatRevenueTick(500)).toBe("500");
    expect(formatRevenueTick(1500)).toBe("2k");
    expect(formatRevenueTick(250000)).toBe("3L");
  });
});
