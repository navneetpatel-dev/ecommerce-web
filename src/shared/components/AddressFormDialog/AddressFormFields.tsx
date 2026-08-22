"use client";

import { CheckboxField } from "@/shared/components/CheckboxField";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import {
  PINCODE_LENGTH,
  type AddressFormValues,
} from "@/shared/schemas/address.schema";

interface AddressFormFieldsProps {
  form: AddressFormValues;
  /** Replaces a single field on the draft address state. */
  setField: <K extends keyof AddressFormValues>(
    field: K,
    value: AddressFormValues[K],
  ) => void;
  hasAddresses: boolean;
  isEditing: boolean;
}

/** Shared field grid for the address create/edit dialog (Rule 2/3 split). */
export function AddressFormFields(props: AddressFormFieldsProps) {
  const { form, setField, hasAddresses, isEditing } = props;

  const updatePincode = (raw: string) => {
    setField("pincode", raw.replace(/\D/g, "").slice(0, PINCODE_LENGTH));
  };

  return (
    <FormSection
      title={LABELS.addressFormSection}
      hint={LABELS.addressFormSectionHint}
    >
      <FormFieldFrame
        label={LABELS.addressLine1}
        htmlFor="shared-addr-line1"
        required
        className="sm:col-span-2"
      >
        <Input
          id="shared-addr-line1"
          value={form.line1}
          onChange={(e) => setField("line1", e.target.value)}
          placeholder={LABELS.addressLine1Placeholder}
          required
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressLine2Optional}
        htmlFor="shared-addr-line2"
        className="sm:col-span-2"
      >
        <Input
          id="shared-addr-line2"
          value={form.line2}
          onChange={(e) => setField("line2", e.target.value)}
          placeholder={LABELS.addressLine2Placeholder}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressCity}
        htmlFor="shared-addr-city"
        required
      >
        <Input
          id="shared-addr-city"
          value={form.city}
          onChange={(e) => setField("city", e.target.value)}
          required
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressState}
        htmlFor="shared-addr-state"
        required
      >
        <Input
          id="shared-addr-state"
          value={form.state}
          onChange={(e) => setField("state", e.target.value)}
          required
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressPincode}
        htmlFor="shared-addr-pincode"
        required
      >
        <Input
          id="shared-addr-pincode"
          inputMode="numeric"
          maxLength={PINCODE_LENGTH}
          value={form.pincode}
          onChange={(e) => updatePincode(e.target.value)}
          required
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressCountry}
        htmlFor="shared-addr-country"
      >
        <Input
          id="shared-addr-country"
          value={form.country}
          onChange={(e) => setField("country", e.target.value)}
        />
      </FormFieldFrame>

      {hasAddresses || isEditing ? (
        <CheckboxField
          id="shared-addr-default"
          className="sm:col-span-2"
          checked={form.isDefault}
          onCheckedChange={(checked) => setField("isDefault", checked)}
          label={LABELS.addressSetDefault}
        />
      ) : null}
    </FormSection>
  );
}
