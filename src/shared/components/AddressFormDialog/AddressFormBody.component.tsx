import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { FormActions, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import type { Address, AddressInput } from "@/shared/api/types";
import { AddressFormFields } from "./AddressFormFields.component";
import { useAddressFormBody } from "../../hooks/address-form-dialog/useAddressFormBody.hook";

export interface AddressFormBodyProps {
  address?: Address | null;
  hasAddresses: boolean;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (body: AddressInput) => Promise<void>;
  /** Direct close (post-save). */
  onClose: () => void;
  /** User-initiated cancel — the host wraps this in its discard guard. */
  onRequestClose?: () => void;
  /** Reports edit state so the host dialog can confirm before discarding. */
  onDirtyChange?: (dirty: boolean) => void;
}

export function AddressFormBody({
  address,
  hasAddresses,
  isPending,
  submitLabel,
  onSubmit,
  onClose,
  onRequestClose,
  onDirtyChange,
}: AddressFormBodyProps) {
  const {
    form,
    formError,
    fieldErrors,
    getError,
    location,
    canSubmit,
    disableHint,
    setField,
    handleFieldInputChange,
    handleDeliveryInstructionsChange,
    handleSubmit,
  } = useAddressFormBody({
    address,
    hasAddresses,
    onSubmit,
    onClose,
    onDirtyChange,
  });

  const handleCancelClick = onRequestClose ?? onClose;

  return (
    <form onSubmit={handleSubmit}>
      <FormStack>
        <AddressFormFields
          form={form}
          setField={setField}
          hasAddresses={hasAddresses}
          isEditing={Boolean(address)}
          fieldErrors={fieldErrors}
          getError={getError}
          locationStatus={location.status}
          onRetryLocation={location.retry}
          onFieldInputChange={handleFieldInputChange}
          onDeliveryInstructionsChange={handleDeliveryInstructionsChange}
        />
        <FormError error={formError} fallback={LABELS.couldNotSaveAddress} />
        <FormActions>
          <Button type="button" variant="outline" onClick={handleCancelClick}>
            {LABELS.cancel}
          </Button>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              loading={isPending}
              disabled={!canSubmit || isPending}
            >
              {submitLabel}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
