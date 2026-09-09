"use client";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { useChartThemeColors } from "@/shared/hooks/useChartThemeColors.hook";
import { useAdminDeliveryPerformancePanel } from "../hooks/useAdminDeliveryPerformancePanel.hook";

/** Admin-only rollup of delivered/RTO/failed-attempt/rating stats per agent over a date range. */
export function AdminDeliveryPerformancePanel() {
  const colors = useChartThemeColors();
  const { from, setFrom, to, setTo, rows, loading, load } =
    useAdminDeliveryPerformancePanel();

  const hasRows = rows.length > 0;

  return (
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="size-5 text-brand" aria-hidden="true" />
          <div>
            <h2 className="font-display text-[1.125rem] font-semibold text-ink">
              Agent delivery performance & metrics
            </h2>
            <p className="text-body-sm text-ink-muted">
              Rollup of fulfillment speed, RTO rates, failed attempts, and
              customer satisfaction.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
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
        <p className="text-body-sm text-ink-muted">
          Loading performance report...
        </p>
      ) : !hasRows ? (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          No delivery activity recorded in this date range.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-body-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-muted">
                  <th className="py-2 pr-3 font-medium">Agent</th>
                  <th className="py-2 pr-3 font-medium">Hub/zone</th>
                  <th className="py-2 pr-3 font-medium">Delivered</th>
                  <th className="py-2 pr-3 font-medium">RTO</th>
                  <th className="py-2 pr-3 font-medium">RTO rate</th>
                  <th className="py-2 pr-3 font-medium">Failed attempts</th>
                  <th className="py-2 pr-3 font-medium">Avg. fulfillment</th>
                  <th className="py-2 pr-3 font-medium">Avg. rating</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.deliveryAgentId}
                    className="border-b border-line/60"
                  >
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5">
                        {row.fullName}
                        {row.flagged ? (
                          <span
                            title={row.flagReason ?? undefined}
                            className="rounded-full border border-danger/30 bg-danger/10 px-1.5 py-0.5 text-caption font-medium text-danger"
                          >
                            Flagged
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-ink-muted">
                      {row.hubOrZone}
                    </td>
                    <td className="py-2 pr-3">{row.delivered}</td>
                    <td className="py-2 pr-3">{row.rto}</td>
                    <td className="py-2 pr-3">{row.rtoRatePercent}%</td>
                    <td className="py-2 pr-3">{row.failedAttempts}</td>
                    <td className="py-2 pr-3">
                      {row.avgFulfillmentHours != null
                        ? `${row.avgFulfillmentHours}h`
                        : "—"}
                    </td>
                    <td className="py-2 pr-3">
                      {row.averageRating != null
                        ? `${row.averageRating} (${row.ratingCount})`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-56 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rows}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={colors.line}
                  strokeDasharray="3 6"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  unit="%"
                  tick={{ fill: colors.inkMuted, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="fullName"
                  width={110}
                  tick={{ fill: colors.inkMuted, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: colors.brandSubtle, opacity: 0.45 }}
                  contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.line}`,
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  formatter={(value: number) => [`${value}%`, "RTO rate"]}
                />
                <Bar
                  dataKey="rtoRatePercent"
                  fill={colors.danger}
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
