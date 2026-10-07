"use client";

import dynamic from "next/dynamic";
import { LABELS } from "@/shared/constants/labels";
import { BarChart3 } from "lucide-react";
import { DateRangeFields } from "@/shared/components/forms/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { SkeletonChartCard } from "@/shared/components/Skeletons.component";
import type { DeliveryAgentPerformance } from "@/features/delivery-dashboard";
import { dateRangeToolbarStyles } from "@/shared/styles/forms/dateRangeToolbar.styles";
import { useAdminDeliveryPerformancePanel } from "../../../hooks/delivery-agents/useAdminDeliveryPerformancePanel.hook";
import { adminDeliveryPerformancePanelStyles } from "../../../styles/delivery-agents/adminDeliveryPerformancePanel.styles";

// Lazy so recharts stays out of the delivery-agents route bundle.
const PerformanceChart = dynamic(
  () =>
    import("./PerformanceChart.component").then((mod) => mod.PerformanceChart),
  { loading: () => <SkeletonChartCard bodyHeight="h-56 sm:h-64" /> },
);

const COLUMNS: DataTableColumn<DeliveryAgentPerformance>[] = [
  {
    id: "agent",
    header: LABELS.agentName,
    truncate: false,
    cell: (row) => (
      <div className={adminDeliveryPerformancePanelStyles.agentNameWrapper}>
        {row.fullName}
        {row.flagged ? (
          <span
            title={row.flagReason ?? undefined}
            className={adminDeliveryPerformancePanelStyles.flagBadge}
          >
            {LABELS.flaggedBadge}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    id: "hub",
    header: LABELS.hubZoneColumn,
    className: adminDeliveryPerformancePanelStyles.tableCellMuted,
    accessor: "hubOrZone",
  },
  {
    id: "delivered",
    header: LABELS.deliveredColumn,
    accessor: "delivered",
  },
  {
    id: "rto",
    header: LABELS.rtoColumn,
    accessor: "rto",
  },
  {
    id: "rtoRate",
    header: LABELS.rtoRateColumn,
    cell: (row) => `${row.rtoRatePercent}%`,
  },
  {
    id: "failedAttempts",
    header: LABELS.flagsFailedAttempts,
    accessor: "failedAttempts",
  },
  {
    id: "avgFulfillment",
    header: LABELS.avgFulfillmentColumn,
    cell: (row) =>
      row.avgFulfillmentHours != null ? `${row.avgFulfillmentHours}h` : "—",
  },
  {
    id: "rating",
    header: LABELS.avgRatingColumn,
    cell: (row) =>
      row.averageRating != null
        ? `${row.averageRating} (${row.ratingCount})`
        : "—",
  },
];

/** Admin-only rollup of delivered/RTO/failed-attempt/rating stats per agent over a date range. */
export function AdminDeliveryPerformancePanel() {
  const { from, setFrom, to, setTo, rows, loading, load } =
    useAdminDeliveryPerformancePanel();

  const hasRows = rows.length > 0;

  return (
    <section className={adminDeliveryPerformancePanelStyles.root}>
      <div className={adminDeliveryPerformancePanelStyles.header}>
        <div className={adminDeliveryPerformancePanelStyles.headerLeft}>
          <BarChart3
            className={adminDeliveryPerformancePanelStyles.headerIcon}
            aria-hidden="true"
          />
          <div>
            <h2 className={adminDeliveryPerformancePanelStyles.title}>
              {LABELS.performancePanelTitle}
            </h2>
            <p className={adminDeliveryPerformancePanelStyles.subtitle}>
              {LABELS.performancePanelSubtitle}
            </p>
          </div>
        </div>

        <div className={adminDeliveryPerformancePanelStyles.filtersWrapper}>
          <DateRangeFields
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
            fromId="performance-from"
            toId="performance-to"
            className={dateRangeToolbarStyles.dateFields}
          />
          <Button type="button" size="sm" loading={loading} onClick={load}>
            {LABELS.applyFilter}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className={adminDeliveryPerformancePanelStyles.loadingText}>
          {LABELS.loadingPerformanceReport}
        </p>
      ) : !hasRows ? (
        <p className={adminDeliveryPerformancePanelStyles.emptyText}>
          {LABELS.noDeliveryActivity}
        </p>
      ) : (
        <>
          <DataTable
            ariaLabel={LABELS.deliveryPerformanceTableAria}

            columns={COLUMNS}
            rows={rows}
            getRowId={(row) => row.deliveryAgentId}
            rowDetails={false}
          />
          <PerformanceChart rows={rows} />
        </>
      )}
    </section>
  );
}
