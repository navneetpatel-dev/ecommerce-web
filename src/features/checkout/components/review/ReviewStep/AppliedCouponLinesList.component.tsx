import { memo } from "react";
import { PAYABLE_SUMMARY_STYLES } from "./payableSummary.styles";

interface AppliedCouponLinesListProps {
  lines: string[];
}

export const AppliedCouponLinesList = memo(function AppliedCouponLinesList({
  lines,
}: AppliedCouponLinesListProps) {
  if (lines.length === 0) return null;

  return (
    <div className={PAYABLE_SUMMARY_STYLES.couponsList}>
      {lines.map((line) => (
        <p key={line} className={PAYABLE_SUMMARY_STYLES.couponLine}>
          {line}
        </p>
      ))}
    </div>
  );
});
