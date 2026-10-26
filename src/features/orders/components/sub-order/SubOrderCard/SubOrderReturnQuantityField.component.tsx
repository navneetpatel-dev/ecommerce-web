import { FormFieldFrame } from "@/shared/components/forms";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ReturnQuantityField } from "../../../hooks/sub-order/useSubOrderReturn.hook";

interface SubOrderReturnQuantityFieldProps {
  field: ReturnQuantityField | null;
}

/** How many of a multi-unit line to return; absent for a single unit. */
export function SubOrderReturnQuantityField({
  field,
}: SubOrderReturnQuantityFieldProps) {
  if (!field) return null;
  return (
    <FormFieldFrame
      label={LABELS.returnQuantityLabel}
      htmlFor="return-quantity"
      hint={formatLabel(LABELS.returnQuantityHint, { max: String(field.max) })}
    >
      <NumberInput
        id="return-quantity"
        value={field.value}
        min={1}
        max={field.max}
        onChange={field.onChange}
      />
    </FormFieldFrame>
  );
}
