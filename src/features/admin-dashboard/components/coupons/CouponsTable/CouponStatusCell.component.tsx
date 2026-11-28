import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { Coupon } from "@/shared/api/types";
import { couponsTableStyles as styles } from "../../../styles/coupons/couponsTable.styles";

interface CouponStatusCellProps {
  coupon: Pick<Coupon, "status" | "rejectionNote">;
}

/** Status badge; a rejected coupon also shows why, so nobody has to open its details. */
export function CouponStatusCell({ coupon }: CouponStatusCellProps) {
  const note = coupon.status === "REJECTED" ? coupon.rejectionNote : null;
  return (
    <span className={styles.statusCell}>
      <StatusBadge status={coupon.status} />
      {note ? (
        <span className={styles.rejectionNote} title={note}>
          {note}
        </span>
      ) : null}
    </span>
  );
}
