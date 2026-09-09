import { CreditCard } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { paymentMethodsLabels as LABELS } from "@/shared/constants/labels/paymentMethods";
import { savedPaymentMethodsSectionStyles as styles } from "./savedPaymentMethodsSection.styles";

export function SavedPaymentMethodsEmptyState() {
  return (
    <div className={styles.emptyWrapper}>
      <EmptyState
        icon={CreditCard}
        heading={LABELS.noSavedPaymentMethodsHeading}
        message={LABELS.noSavedPaymentMethodsMessage}
        className={styles.emptyState}
      />
    </div>
  );
}
