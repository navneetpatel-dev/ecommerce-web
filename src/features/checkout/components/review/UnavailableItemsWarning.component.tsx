import { AlertTriangle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { REVIEW_STEP_STYLES } from "../../styles/review/reviewStep.styles";

export function UnavailableItemsWarning() {
  return (
    <div className={REVIEW_STEP_STYLES.warningBanner}>
      <AlertTriangle
        size={16}
        className={REVIEW_STEP_STYLES.warningIcon}
        aria-hidden
      />
      <p className={REVIEW_STEP_STYLES.warningText}>
        {LABELS.removeUnavailableToCheckout}
      </p>
    </div>
  );
}
