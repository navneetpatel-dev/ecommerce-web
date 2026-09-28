import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddressFormFields } from "../AddressFormFields.component";
import { LABELS } from "@/shared/constants/labels";
import type { AddressFormValues } from "@/shared/schemas/address.schema";

const emptyAddress: AddressFormValues = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: LABELS.defaultCountry,
  pincode: "",
  deliveryInstructions: "",
  isDefault: false,
  lat: null,
  lng: null,
};

/**
 * Autofill tokens (WCAG 1.3.5 / HTML autofill): without them mobile browsers
 * cannot offer the saved address, so every Indian checkout is typed by hand.
 */
const autofillExpectations: Array<[keyof AddressFormValues, string, string]> = [
  ["line1", LABELS.addressLine1, "address-line1"],
  ["line2", LABELS.addressLine2Optional, "address-line2"],
  ["city", LABELS.addressCity, "address-level2"],
  ["state", LABELS.addressState, "address-level1"],
  ["pincode", LABELS.addressPincode, "postal-code"],
  ["country", LABELS.addressCountry, "country-name"],
];

function renderFields() {
  return render(
    <AddressFormFields
      form={emptyAddress}
      setField={vi.fn()}
      hasAddresses={false}
      isEditing={false}
    />,
  );
}

describe("AddressFormFields autofill", () => {
  it.each(autofillExpectations)(
    "marks the %s field with autocomplete=%s",
    (_field, label, token) => {
      renderFields();

      expect(screen.getByLabelText(label, { exact: false })).toHaveAttribute(
        "autocomplete",
        token,
      );
    },
  );
});
