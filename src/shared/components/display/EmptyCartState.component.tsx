import { ShoppingBag } from "lucide-react";
import { EmptyState } from "./EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { emptyCartStateStyles } from "../../styles/display/displayComponents.styles";

interface EmptyCartStateProps {
  heading: string;
  message: string;
}

/** Shared "empty cart" hero used by both the cart page and checkout. */
export function EmptyCartState({ heading, message }: EmptyCartStateProps) {
  return (
    <div className={emptyCartStateStyles.container}>
      <div aria-hidden className={emptyCartStateStyles.radialGlow} />
      <div className={emptyCartStateStyles.inner}>
        <EmptyState
          icon={ShoppingBag}
          heading={heading}
          message={message}
          actionLabel={LABELS.continueShopping}
          actionTo={PATHS.products}
        />
      </div>
    </div>
  );
}
