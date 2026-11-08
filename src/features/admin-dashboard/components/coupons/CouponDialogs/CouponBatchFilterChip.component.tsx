"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { couponDialogStyles as styles } from "../../../styles/coupons/couponDialogs.styles";

interface CouponBatchFilterChipProps {
  batchName: string;
  onClear: () => void;
}

/** Says the list is limited to one batch's codes, with the way back to every coupon. */
export function CouponBatchFilterChip({
  batchName,
  onClear,
}: CouponBatchFilterChipProps) {
  return (
    <p role="status" className={styles.batchChip}>
      <span className={styles.batchChipText}>
        {formatLabel(LABELS.showingBatchCodes, { name: batchName })}
      </span>
      <Button type="button" size="sm" variant="ghost" onClick={onClear}>
        <X aria-hidden /> {LABELS.showAllCoupons}
      </Button>
    </p>
  );
}
