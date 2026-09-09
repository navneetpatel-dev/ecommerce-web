import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormError } from "@/shared/components/FormError.component";
import { FormActions, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import type { Address, AddressInput } from "@/shared/api/types";
import { AddressFormFields } from "./AddressFormFields.component";
import { useAddressFormBody } from "./useAddressFormBody.hook";

export interface AddressFormBodyProps {
  address?: Address | null;
  hasAddresses: boolean;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (body: AddressInput) => Promise<void>;
  onClose: () => void;
}

export function AddressFormBody({
  address,
  hasAddresses,
  isPending,
  submitLabel,
  onSubmit,
  onClose,
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
    handleSubmit,
  } = useAddressFormBody({
    address,
    hasAddresses,
    onSubmit,
    onClose,
  });

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
        />
        <FormError error={formError} fallback={LABELS.couldNotSaveAddress} />
        <FormActions>
          <Button type="button" variant="outline" onClick={onClose}>
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
