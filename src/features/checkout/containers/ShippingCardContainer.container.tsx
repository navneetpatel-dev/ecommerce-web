"use client";

import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { ShippingCard } from "../components/ShippingCard.component";
import { useShippingCard } from "../hooks/useShippingCard.hook";
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
  weightGrams: number;
  selected?: string;
  onSelect: (method: ShippingMethod) => void;
}

export function ShippingCardContainer({
  vendor,
  pincode,
  weightGrams,
  selected,
  onSelect,
}: ShippingCardContainerProps) {
  const { options, isLoading, isError, error } = useShippingCard(
    pincode,
    weightGrams,
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
