import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import type { Coupon } from "@/shared/api/types";
import { vendorCouponsViewStyles } from "../../../styles/coupons/vendorCouponsView.styles";

const usageCell = (row: Coupon) =>
  `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`;

/** Columns of the vendor coupons table (code, type, usage, status, expiry). */
export function buildVendorCouponColumns(): DataTableColumn<Coupon>[] {
  return [
    {
      id: "code",
      header: LABELS.couponCode,
      className: vendorCouponsViewStyles.colMono,
      cell: (row) => row.code,
    },
    {
      id: "type",
      header: LABELS.couponType,
      accessor: "type",
    },
    {
      id: "usage",
      header: LABELS.couponUsage,
      className: vendorCouponsViewStyles.colMonoSm,
      cell: usageCell,
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
