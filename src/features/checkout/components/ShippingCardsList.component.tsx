import { memo, useCallback } from "react";
import type { CartItem } from "@/shared/api/types";
import type { ShippingMethod } from "@/shared/constants/statuses";
import { ShippingCardContainer } from "../containers/ShippingCardContainer.container";
import { SHIPPING_STEP_STYLES } from "./shippingStep.styles";

interface ShippingCardsListProps {
  vendors: [string, CartItem[]][];
  selectedMethods: Record<string, string>;
  pincode: string;
  onSelect: (vendorId: string, method: ShippingMethod) => void;
}

export const ShippingCardsList = memo(function ShippingCardsList({
  vendors,
  selectedMethods,
  pincode,
  onSelect,
}: ShippingCardsListProps) {
  const handleSelectVendorMethod = useCallback(
    (vendorId: string, method: ShippingMethod) => {
      onSelect(vendorId, method);
    },
    [onSelect],
  );

  return (
    <div className={SHIPPING_STEP_STYLES.vendorList}>
      {vendors.map(([vendorId, items]) => (
        <ShippingCardContainer
          key={vendorId}
          vendorId={vendorId}
          vendor={items[0].product.vendor}
          pincode={pincode}
          selected={selectedMethods[vendorId]}
          onSelect={(method) => handleSelectVendorMethod(vendorId, method)}
        />
      ))}
    </div>
  );
});
