"use client";

import { BarChart3 } from "lucide-react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { useAdminDeliveryPerformancePanel } from "../../../hooks/delivery-agents/useAdminDeliveryPerformancePanel.hook";
import { adminDeliveryPerformancePanelStyles } from "./adminDeliveryPerformancePanel.styles";
import { PerformanceTableBody } from "./PerformanceTableBody.component";
import { PerformanceChart } from "./PerformanceChart.component";

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
          <div className={adminDeliveryPerformancePanelStyles.tableWrapper}>
            <table className={adminDeliveryPerformancePanelStyles.table}>
              <thead>
                <tr
                  className={adminDeliveryPerformancePanelStyles.tableHeaderRow}
                >
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    Agent
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    Hub/zone
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    Delivered
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    RTO
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    RTO rate
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    Failed attempts
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    Avg. fulfillment
                  </th>
                  <th
                    className={
                      adminDeliveryPerformancePanelStyles.tableHeaderCell
                    }
                  >
                    Avg. rating
                  </th>
                </tr>
              </thead>
              <PerformanceTableBody rows={rows} />
            </table>
          </div>

          <PerformanceChart rows={rows} />
        </>
      )}
    </section>
  );
}
