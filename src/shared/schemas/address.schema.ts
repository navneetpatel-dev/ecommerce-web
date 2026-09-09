import { z } from "zod";
import { PINCODE_LENGTH, PINCODE_PATTERN } from "@/shared/constants/geo/pincode";
import { LABELS } from "@/shared/constants/labels";
import type { Address, AddressInput } from "@/shared/api/types";

/**
 * Schema module for the shared address form (Rule 16): field shapes,
 * validation rules and error messages live here — not in components.
 */
export const addressFormSchema = z.object({
  line1: z.string().trim().min(1, LABELS.enterAddressLine1),
  line2: z.string(),
  city: z.string().trim().min(1, LABELS.enterAddressCity),
  state: z.string().trim().min(1, LABELS.enterAddressState),
  country: z.string(),
  pincode: z.string().trim().regex(PINCODE_PATTERN, LABELS.invalidPincode),
  isDefault: z.boolean(),
  deliveryInstructions: z.string().max(500),
  // Device-captured GPS fix, not a geocode of the typed address — required to
  // save so the delivery-tracking page can show a live-ETA distance.
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export interface AddressFieldCheck {
  ok: boolean;
  message: string;
}

/** Per-field requirement checks driving the disabled-submit hint. */
export function addressFieldChecks(
  values: AddressFormValues,
): AddressFieldCheck[] {
  return [
    {
      ok: values.line1.trim().length > 0,
      message: LABELS.enterAddressLine1,
    },
    { ok: values.city.trim().length > 0, message: LABELS.enterAddressCity },
    { ok: values.state.trim().length > 0, message: LABELS.enterAddressState },
    {
      ok: PINCODE_PATTERN.test(values.pincode.trim()),
      message: LABELS.invalidPincode,
    },
    {
      ok: values.lat != null && values.lng != null,
      message: LABELS.addressLocationRequired,
    },
  ];
}

export function toAddressFormState(
  address?: Address | null,
): AddressFormValues {
  return {
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    country: address?.country ?? LABELS.defaultCountry,
    pincode: address?.pincode ?? "",
    isDefault: address?.isDefault ?? false,
    deliveryInstructions: address?.deliveryInstructions ?? "",
    lat: address?.lat ?? null,
    lng: address?.lng ?? null,
  };
}

export function toAddressInput(
  values: AddressFormValues,
  hasAddresses: boolean,
): AddressInput {
  return {
    line1: values.line1.trim(),
    line2: values.line2.trim() || null,
    city: values.city.trim(),
    state: values.state.trim(),
    country: values.country.trim() || LABELS.defaultCountry,
    pincode: values.pincode.trim(),
    isDefault: values.isDefault || !hasAddresses,
    deliveryInstructions: values.deliveryInstructions.trim() || null,
    lat: values.lat,
    lng: values.lng,
  };
}

export { PINCODE_LENGTH };
