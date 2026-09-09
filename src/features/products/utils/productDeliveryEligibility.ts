import type { ShippingRate } from "@/shared/api/types";

export interface DeliveryEligibilityInput {
  rates: ShippingRate[];
  submitted: boolean;
  isFetching: boolean;
  codAvailable: boolean;
  codEligibleAtUnitPrice: boolean;
}

export interface DeliveryEligibility {
  fastest: ShippingRate | null;
  serviceable: boolean;
  notServiceable: boolean;
  codConfirmed: boolean;
  codBlockedByPincode: boolean;
  belowCodMin: boolean;
}

/** Derives PDP delivery-check display state (fastest ETA, serviceability, COD eligibility). */
export function computeDeliveryEligibility({
  rates,
  submitted,
  isFetching,
  codAvailable,
  codEligibleAtUnitPrice,
}: DeliveryEligibilityInput): DeliveryEligibility {
  const fastest = rates.reduce<ShippingRate | null>((best, rate) => {
    if (!best || rate.estimatedDays < best.estimatedDays) return rate;
    return best;
  }, null);
  const serviceable = submitted && !isFetching && rates.length > 0;
  const notServiceable = submitted && !isFetching && rates.length === 0;
  const showCod = codAvailable && codEligibleAtUnitPrice;
  const codConfirmed = showCod && serviceable;
  const codBlockedByPincode = showCod && notServiceable;
  const belowCodMin = codAvailable && !codEligibleAtUnitPrice;

  return {
    fastest,
    serviceable,
    notServiceable,
    codConfirmed,
    codBlockedByPincode,
    belowCodMin,
  };
}
