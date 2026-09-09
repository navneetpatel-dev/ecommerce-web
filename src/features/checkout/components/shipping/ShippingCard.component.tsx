import { VendorStrip } from "@/shared/components/VendorStrip.component";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { ShippingRate } from "@/shared/api/types";
import { ShippingRatesList } from "./ShippingRatesList.component";
import { SHIPPING_CARD_STYLES } from "../../styles/shipping/shippingCard.styles";

interface ShippingCardProps {
  vendor: {
    id: string;
    businessName: string;
    slug: string;
    logoUrl: string | null;
  };
  options: ShippingRate[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  selected?: string;
  onSelect: (method: ShippingMethod) => void;
}

export function ShippingCard({
  vendor,
  options,
  isLoading,
  isError,
  errorMessage,
  selected,
  onSelect,
}: ShippingCardProps) {
  const showEmptyMessage = !isLoading && !isError && options.length === 0;

  return (
    <section className={SHIPPING_CARD_STYLES.card}>
      <VendorStrip vendor={vendor} />

      {isLoading && (
        <p className={SHIPPING_CARD_STYLES.loadingText}>
          Loading shipping rates…
        </p>
      )}

      {isError && errorMessage && (
        <p className={SHIPPING_CARD_STYLES.errorText}>{errorMessage}</p>
      )}

      {showEmptyMessage && (
        <p className={SHIPPING_CARD_STYLES.emptyText}>
          No shipping rates are configured for this delivery area yet.
        </p>
      )}

      <ShippingRatesList
        options={options}
        selected={selected}
        onSelect={onSelect}
      />
    </section>
  );
}
