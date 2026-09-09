"use client";

import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import type { LocationCaptureStatus } from "../../hooks/address-form-dialog/useCaptureLocation.hook";
import {
  PINCODE_LENGTH,
  type AddressFormValues,
} from "@/shared/schemas/address.schema";
import { AddressLocationStatusNotice } from "./AddressLocationStatusNotice.component";
import { addressFormDialogStyles } from "../../styles/address-form-dialog/addressFormDialog.styles";

interface AddressFormFieldsProps {
  form: AddressFormValues;
  /** Replaces a single field on the draft address state. */
  setField: <K extends keyof AddressFormValues>(
    field: K,
    value: AddressFormValues[K],
  ) => void;
  hasAddresses: boolean;
  isEditing: boolean;
  fieldErrors?: Partial<Record<keyof AddressFormValues, string>>;
  getError?: (field: keyof AddressFormValues) => string | undefined;
  locationStatus?: LocationCaptureStatus;
  onRetryLocation?: () => void;
}

/** Shared field grid for the address create/edit dialog (Rule 2/3 split). */
export function AddressFormFields(props: AddressFormFieldsProps) {
  const {
    form,
    setField,
    hasAddresses,
    isEditing,
    getError,
    locationStatus,
    onRetryLocation,
  } = props;

  const fieldError = (field: keyof AddressFormValues) => getError?.(field);

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
        className={addressFormDialogStyles.colSpan2}
        error={fieldError("line1")}
      >
        <Input
          id="shared-addr-line1"
          value={form.line1}
          onChange={(e) => setField("line1", e.target.value)}
          placeholder={LABELS.addressLine1Placeholder}
          required
          error={Boolean(fieldError("line1"))}
        />
      </FormFieldFrame>

      {locationStatus && locationStatus !== "success" ? (
        <AddressLocationStatusNotice
          status={locationStatus}
          onRetry={onRetryLocation}
        />
      ) : null}

      <FormFieldFrame
        label={LABELS.addressLine2Optional}
        htmlFor="shared-addr-line2"
        className={addressFormDialogStyles.colSpan2}
        error={fieldError("line2")}
      >
        <Input
          id="shared-addr-line2"
          value={form.line2}
          onChange={(e) => setField("line2", e.target.value)}
          placeholder={LABELS.addressLine2Placeholder}
          error={Boolean(fieldError("line2"))}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressCity}
        htmlFor="shared-addr-city"
        required
        error={fieldError("city")}
      >
        <Input
          id="shared-addr-city"
          value={form.city}
          onChange={(e) => setField("city", e.target.value)}
          required
          error={Boolean(fieldError("city"))}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressState}
        htmlFor="shared-addr-state"
        required
        error={fieldError("state")}
      >
        <Input
          id="shared-addr-state"
          value={form.state}
          onChange={(e) => setField("state", e.target.value)}
          required
          error={Boolean(fieldError("state"))}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressPincode}
        htmlFor="shared-addr-pincode"
        required
        error={fieldError("pincode")}
      >
        <Input
          id="shared-addr-pincode"
          inputMode="numeric"
          maxLength={PINCODE_LENGTH}
          value={form.pincode}
          onChange={(e) => updatePincode(e.target.value)}
          required
          error={Boolean(fieldError("pincode"))}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressCountry}
        htmlFor="shared-addr-country"
        error={fieldError("country")}
      >
        <Input
          id="shared-addr-country"
          value={form.country}
          onChange={(e) => setField("country", e.target.value)}
          error={Boolean(fieldError("country"))}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.addressDeliveryInstructionsOptional}
        htmlFor="shared-addr-delivery-instructions"
        className={addressFormDialogStyles.colSpan2}
        error={fieldError("deliveryInstructions")}
      >
        <Textarea
          id="shared-addr-delivery-instructions"
          value={form.deliveryInstructions}
          onChange={(e) => setField("deliveryInstructions", e.target.value)}
          placeholder={LABELS.addressDeliveryInstructionsPlaceholder}
          rows={2}
          maxLength={500}
          error={Boolean(fieldError("deliveryInstructions"))}
        />
      </FormFieldFrame>

      {hasAddresses || isEditing ? (
        <CheckboxField
          id="shared-addr-default"
          className={addressFormDialogStyles.colSpan2}
          checked={form.isDefault}
          onCheckedChange={(checked) => setField("isDefault", checked)}
          label={LABELS.addressSetDefault}
        />
      ) : null}
    </FormSection>
  );
}
