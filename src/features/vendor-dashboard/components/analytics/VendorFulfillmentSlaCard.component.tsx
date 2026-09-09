"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { vendorFulfillmentSlaStyles } from "./vendorAnalyticsWidgets.styles";

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
      <CardHeader className={vendorFulfillmentSlaStyles.cardHeader}>
        <CardTitle className={vendorFulfillmentSlaStyles.cardTitle}>
          {vendorDashboardWidgetsLabels.vendorAnalyticsFulfillmentSla}
        </CardTitle>
        <CardDescription>
          {vendorDashboardWidgetsLabels.vendorAnalyticsFulfillmentSlaHint}
        </CardDescription>
      </CardHeader>
      <CardContent className={vendorFulfillmentSlaStyles.cardContent}>
        <div className={vendorFulfillmentSlaStyles.row}>
          <span className={vendorFulfillmentSlaStyles.metricLabel}>
            {vendorDashboardWidgetsLabels.vendorAnalyticsOnTime}
          </span>
          <span className={vendorFulfillmentSlaStyles.onTimeValue}>
            {onTimePercent.toFixed(1)}%
          </span>
        </div>
        <div className={vendorFulfillmentSlaStyles.progressBarWrapper}>
          <div
            className={vendorFulfillmentSlaStyles.progressBarFill}
            style={{ width: `${Math.min(100, onTimePercent)}%` }}
          />
        </div>
        <div className={vendorFulfillmentSlaStyles.row}>
          <span className={vendorFulfillmentSlaStyles.metricLabel}>
            {vendorDashboardWidgetsLabels.vendorAnalyticsLate}
          </span>
          <span className={vendorFulfillmentSlaStyles.lateValue}>
            {latePercent.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
