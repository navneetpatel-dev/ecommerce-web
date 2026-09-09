import type { SavedPaymentMethod } from "../../../types/layout/types";
import type { SavedPaymentMethodViewModel } from "../../../hooks/payment-methods/useSavedPaymentMethodsSection.hook";
import { SavedPaymentMethodCard } from "./SavedPaymentMethodCard.component";
import { savedPaymentMethodsSectionStyles as styles } from "../../../styles/payment-methods/savedPaymentMethodsSection.styles";

interface SavedPaymentMethodsListProps {
  methods: SavedPaymentMethodViewModel[];
  onDelete: (method: SavedPaymentMethod) => void;
}

export function SavedPaymentMethodsList({
  methods,
  onDelete,
}: SavedPaymentMethodsListProps) {
  return (
    <ul className={styles.listGrid}>
      {methods.map((method) => (
        <SavedPaymentMethodCard
          key={method.id}
          method={method}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
