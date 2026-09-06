"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";

interface VendorFulfillmentSlaCardProps {
  onTimePercent: number;
  latePercent: number;
}

/** On-time vs. late delivery share for the vendor analytics dashboard. */
export function VendorFulfillmentSlaCard({
  onTimePercent,
  latePercent,
}: VendorFulfillmentSlaCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-body-lg">
          {vendorDashboardWidgetsLabels.vendorAnalyticsFulfillmentSla}
        </CardTitle>
        <CardDescription>
          {vendorDashboardWidgetsLabels.vendorAnalyticsFulfillmentSlaHint}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-ink-muted">
            {vendorDashboardWidgetsLabels.vendorAnalyticsOnTime}
          </span>
          <span className="font-mono text-[1.375rem] font-bold text-success">
            {onTimePercent.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-success"
            style={{ width: `${Math.min(100, onTimePercent)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-ink-muted">
            {vendorDashboardWidgetsLabels.vendorAnalyticsLate}
          </span>
          <span className="font-mono text-body font-medium text-danger">
            {latePercent.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
