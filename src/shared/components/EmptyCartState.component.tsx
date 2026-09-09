import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";

interface EmptyCartStateProps {
  heading: string;
  message: string;
}

/** Shared "empty cart" hero used by both the cart page and checkout. */
export function EmptyCartState({ heading, message }: EmptyCartStateProps) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />
      <div className="storefront-container relative py-16 md:py-20">
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
