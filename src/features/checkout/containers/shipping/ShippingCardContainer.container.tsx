"use client";

import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { ShippingCard } from "../../components/shipping/ShippingCard.component";
import { useShippingCard } from "../../hooks/shipping/useShippingCard.hook";
import type { ShippingMethod } from "@/shared/constants/statuses";

interface ShippingCardContainerProps {
  vendorId: string;
  vendor: {
    id: string;
    businessName: string;
    slug: string;
    logoUrl: string | null;
  };
  pincode: string;
  selected?: string;
  onSelect: (method: ShippingMethod) => void;
}

export function ShippingCardContainer({
  vendorId,
  vendor,
  pincode,
  selected,
  onSelect,
}: ShippingCardContainerProps) {
  const { options, isLoading, isError, error } = useShippingCard(
    pincode,
    vendorId,
  );

  return (
    <ShippingCard
      vendor={vendor}
      options={options}
      isLoading={isLoading}
      isError={isError}
      errorMessage={
        error
          ? getApiErrorMessage(error, LABELS.couldNotLoadShippingRates)
          : undefined
      }
      selected={selected}
      onSelect={onSelect}
    />
  );
}
