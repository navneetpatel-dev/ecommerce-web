import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { SavedPaymentMethod } from "../../../types/layout/types";
import type { SavedPaymentMethodViewModel } from "../../../hooks/payment-methods/useSavedPaymentMethodsSection.hook";
import { savedPaymentMethodsSectionStyles as styles } from "../../../styles/payment-methods/savedPaymentMethodsSection.styles";

interface SavedPaymentMethodCardProps {
  method: SavedPaymentMethodViewModel;
  onDelete: (method: SavedPaymentMethod) => void;
}

export function SavedPaymentMethodCard({
  method,
  onDelete,
}: SavedPaymentMethodCardProps) {
  const { icon: Icon, title, subtitle, isDeleting, raw } = method;

  const handleDeleteClick = () => {
    onDelete(raw);
  };

  return (
    <li className={styles.card}>
      <div className={styles.cardContent}>
        <span className={styles.iconBox}>
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <div className={styles.cardDetails}>
          <p className={styles.cardTitle}>{title}</p>
          {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isDeleting}
        onClick={handleDeleteClick}
        aria-label="Remove payment method"
      >
        <Trash2 size={16} />
      </Button>
    </li>
  );
}
