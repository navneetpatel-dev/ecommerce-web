"use client";

import { BarChart3 } from "lucide-react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { DeliveryAgentPerformance } from "@/features/delivery-dashboard";
import { dateRangeToolbarStyles } from "@/shared/styles/forms/dateRangeToolbar.styles";
import { useAdminDeliveryPerformancePanel } from "../../../hooks/delivery-agents/useAdminDeliveryPerformancePanel.hook";
import { adminDeliveryPerformancePanelStyles } from "../../../styles/delivery-agents/adminDeliveryPerformancePanel.styles";
import { PerformanceChart } from "./PerformanceChart.component";

const COLUMNS: DataTableColumn<DeliveryAgentPerformance>[] = [
  {
    id: "agent",
    header: "Agent",
    truncate: false,
    cell: (row) => (
      <div className={adminDeliveryPerformancePanelStyles.agentNameWrapper}>
        {row.fullName}
        {row.flagged ? (
          <span
            title={row.flagReason ?? undefined}
            className={adminDeliveryPerformancePanelStyles.flagBadge}
          >
            Flagged
          </span>
        ) : null}
      </div>
    ),
  },
  {
    id: "hub",
    header: "Hub/zone",
    className: adminDeliveryPerformancePanelStyles.tableCellMuted,
    accessor: "hubOrZone",
  },
  {
    id: "delivered",
    header: "Delivered",
    accessor: "delivered",
  },
  {
    id: "rto",
    header: "RTO",
    accessor: "rto",
  },
  {
    id: "rtoRate",
    header: "RTO rate",
    cell: (row) => `${row.rtoRatePercent}%`,
  },
  {
    id: "failedAttempts",
    header: "Failed attempts",
    accessor: "failedAttempts",
  },
  {
    id: "avgFulfillment",
    header: "Avg. fulfillment",
    cell: (row) =>
      row.avgFulfillmentHours != null ? `${row.avgFulfillmentHours}h` : "—",
  },
  {
    id: "rating",
    header: "Avg. rating",
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
              Agent delivery performance & metrics
            </h2>
            <p className={adminDeliveryPerformancePanelStyles.subtitle}>
              Rollup of fulfillment speed, RTO rates, failed attempts, and
              customer satisfaction.
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
            Apply filter
          </Button>
        </div>
      </div>

      {loading ? (
        <p className={adminDeliveryPerformancePanelStyles.loadingText}>
          Loading performance report...
        </p>
      ) : !hasRows ? (
        <p className={adminDeliveryPerformancePanelStyles.emptyText}>
          No delivery activity recorded in this date range.
        </p>
      ) : (
        <>
          <DataTable
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
