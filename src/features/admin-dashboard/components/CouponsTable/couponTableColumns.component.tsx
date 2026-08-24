import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { DISCOUNT_BEARER } from "@/shared/constants/statuses";
import { formatDateTime } from "@/shared/utils/formatDate";
import type { Coupon } from "@/shared/api/types";

function bearerLabel(bearer: Coupon["discountBearer"]) {
  return bearer === DISCOUNT_BEARER.VENDOR
    ? LABELS.discountBearerVendor
    : LABELS.discountBearerPlatform;
}

export function buildCouponColumns(): DataTableColumn<Coupon>[] {
  return [
    {
      id: "code",
      header: LABELS.couponCode,
      className: "font-mono",
      cell: (row) => row.code,
    },
    {
      id: "type",
      header: LABELS.couponType,
      accessor: "type",
    },
    {
      id: "bearer",
      header: LABELS.discountBearer,
      cell: (row) => bearerLabel(row.discountBearer),
    },
    {
      id: "vendor",
      header: LABELS.vendorId,
      className: "font-mono text-body-sm",
      cell: (row) => row.vendorId ?? "—",
    },
    {
      id: "usage",
      header: LABELS.couponUsage,
      className: "font-mono text-body-sm",
      truncate: false,
      cell: (row) =>
        `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`,
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "expires",
      header: LABELS.expires,
      cell: (row) => formatDateTime(row.endDate),
    },
  ];
}
