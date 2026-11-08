import type { DataTableColumn } from "@/shared/components/DataTable";
import { CopyTextButton } from "@/shared/components/actions/CopyTextButton.component";
import { LABELS } from "@/shared/constants/labels";
import type { Coupon } from "@/shared/api/types";
import {
  couponRestrictionLabel,
  couponScopeLabel,
  couponTypeLabel,
  couponValidityLabel,
  couponValueLabel,
} from "../../../utils/coupons/couponSummary";
import { CouponStatusCell } from "./CouponStatusCell.component";
import { couponsTableStyles as styles } from "../../../styles/coupons/couponsTable.styles";

/**
 * Columns for one coupons tab. Who funds the coupon is the tab itself (platform or
 * vendor), so no column repeats it, and the vendor name only means something on the
 * vendor tab. Status sits next to the code so it's never under the sticky actions.
 */
export function buildCouponColumns(
  options: { vendorTab?: boolean } = {},
): DataTableColumn<Coupon>[] {
  const columns: DataTableColumn<Coupon>[] = [
    {
      id: "code",
      header: LABELS.couponCode,
      className: styles.columnMono,
      cell: (row) => (
        <span className={styles.codeCell}>
          {row.code}
          <CopyTextButton value={row.code} label={LABELS.copyCouponCode} />
        </span>
      ),
    },
    {
      id: "status",
      header: LABELS.status,
      truncate: false,
      cell: (row) => <CouponStatusCell coupon={row} />,
    },
    {
      id: "type",
      header: LABELS.couponType,
      cell: (row) => couponTypeLabel(row),
    },
    {
      id: "value",
      header: LABELS.valueColumn,
      cell: (row) => couponValueLabel(row),
    },
    {
      id: "scope",
      header: LABELS.scopeColumn,
      cell: (row) => couponScopeLabel(row),
    },
    {
      id: "restriction",
      header: LABELS.restrictionColumn,
      cell: (row) => couponRestrictionLabel(row),
    },
  ];
  if (options.vendorTab) {
    columns.push({
      id: "vendor",
      header: LABELS.vendorColumn,
      cell: (row) => row.vendorName ?? "—",
    });
  }
  columns.push(
    {
      id: "usage",
      header: LABELS.couponUsage,
      className: styles.columnMonoSm,
      truncate: false,
      cell: (row) =>
        `${row.usedCount}/${row.usageLimitTotal ?? LABELS.usageUnlimited}`,
    },
    {
      id: "valid",
      header: LABELS.validColumn,
      cell: (row) => couponValidityLabel(row),
    },
  );
  return columns;
}
