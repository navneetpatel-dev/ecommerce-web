import { memo } from "react";
import type { VendorBreakdown } from "@/shared/api/types";
import { VendorBreakdownCard } from "./ReviewStep/VendorBreakdownCard.component";
import { REVIEW_STEP_STYLES } from "./reviewStep.styles";

interface VendorBreakdownsListProps {
  breakdowns: VendorBreakdown[];
}

export const VendorBreakdownsList = memo(function VendorBreakdownsList({
  breakdowns,
}: VendorBreakdownsListProps) {
  return (
    <div className={REVIEW_STEP_STYLES.breakdownsList}>
      {breakdowns.map((breakdown) => (
        <VendorBreakdownCard key={breakdown.vendorId} breakdown={breakdown} />
      ))}
    </div>
  );
});
