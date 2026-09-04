"use client";

import { useEffect, useState } from "react";
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
import {
  deliveryAdminApi,
  type DeliveryAgentPerformance,
} from "@/features/delivery-dashboard";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { useChartThemeColors } from "../utils/chartTheme";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const DEFAULT_TO = new Date();
const DEFAULT_FROM = new Date(DEFAULT_TO.getTime() - 30 * 24 * 60 * 60 * 1000);

/** Admin-only rollup of delivered/RTO/failed-attempt/rating stats per agent over a date range. */
export function AdminDeliveryPerformancePanel() {
  const colors = useChartThemeColors();
  const [from, setFrom] = useState(isoDate(DEFAULT_FROM));
  const [to, setTo] = useState(isoDate(DEFAULT_TO));
  const [rows, setRows] = useState<DeliveryAgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchReport(rangeFrom: string, rangeTo: string) {
    return deliveryAdminApi
      .performanceReport(rangeFrom, rangeTo)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchReport(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => {
    setLoading(true);
    fetchReport(from, to);
  };

  const hasRows = rows.length > 0;

  return (
    <section className="space-y-3 border-b border-line pb-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-4 text-brand" aria-hidden="true" />
        <TextEyebrow className="!mb-0">Delivery performance</TextEyebrow>
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
          Load
        </Button>
      </div>

      {loading ? (
        <p className="text-body-sm text-ink-muted">
          Loading performance report...
        </p>
      ) : !hasRows ? (
        <p className="text-body-sm text-ink-muted">
          No delivery activity in this date range.
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
                    <td className="py-2 pr-3">{row.fullName}</td>
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
