import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import type { CouponBatch } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

export function buildCouponBatchColumns(): DataTableColumn<CouponBatch>[] {
  return [
    { id: "name", header: LABELS.bulkBatchName, accessor: "name" },
    {
      id: "count",
      header: LABELS.batchGeneratedCount,
      cell: (row) => row.generatedCount,
    },
    {
      id: "redemptions",
      header: LABELS.batchRedemptions,
      cell: (row) => row.redemptionCount ?? 0,
    },
    {
      id: "discount",
      header: LABELS.batchDiscountImpact,
      className: "tabular-nums",
      cell: (row) => formatInr(row.discountTotal),
    },
    {
      id: "revenue",
      header: LABELS.batchRevenueImpact,
      className: "tabular-nums",
      cell: (row) => formatInr(row.revenueImpact),
    },
    {
      id: "expires",
      header: LABELS.batchExpires,
      cell: (row) =>
        row.expiresAt ? formatDateTime(row.expiresAt) : LABELS.usageUnlimited,
    },
    {
      id: "created",
      header: LABELS.startDate,
      cell: (row) => formatDateTime(row.createdAt),
    },
  ];
}
