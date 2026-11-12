"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { AddressFormValues } from "@/shared/schemas/address.schema";

interface AddressRecipientFieldsProps {
  form: AddressFormValues;
  getError?: (field: keyof AddressFormValues) => string | undefined;
  onFieldInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** Who receives the parcel (B-37): name and phone the courier uses. */
export function AddressRecipientFields({
  form,
  getError,
  onFieldInputChange,
}: AddressRecipientFieldsProps) {
  const nameError = getError?.("recipientName");
  const phoneError = getError?.("recipientPhone");

  return (
    <FormSection
      title={LABELS.addressRecipientSection}
      hint={LABELS.addressRecipientSectionHint}
    >
      <FormFieldFrame
        label={LABELS.addressRecipientName}
        htmlFor="shared-addr-recipient-name"
        required
        error={nameError}
      >
        <Input
          id="shared-addr-recipient-name"
          name="recipientName"
          autoComplete="name"
          maxLength={100}
          value={form.recipientName}
          onChange={onFieldInputChange}
          required
          error={Boolean(nameError)}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.addressRecipientPhone}
        htmlFor="shared-addr-recipient-phone"
        required
        error={phoneError}
      >
        <Input
          id="shared-addr-recipient-phone"
          name="recipientPhone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={20}
          value={form.recipientPhone}
          onChange={onFieldInputChange}
          required
          error={Boolean(phoneError)}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
