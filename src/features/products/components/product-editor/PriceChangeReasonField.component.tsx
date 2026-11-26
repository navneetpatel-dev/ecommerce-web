"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import type { ProductEditorFormProps } from "../../types/product-editor/types";
import { ADMIN_NOTE_LIMITS } from "../../constants/listing-form/productFields";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";

interface PriceChangeReasonFieldProps {
  reason: ProductEditorFormProps["reason"];
  disabled: boolean;
}

/** Why a live vendor product's price is changing; shown only when the policy requires it. */
export function PriceChangeReasonField({
  reason,
  disabled,
}: PriceChangeReasonFieldProps) {
  if (!reason?.required) return null;
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    reason.onChange(event.target.value);
  };
  return (
    <FormFieldFrame
      counter={{ value: reason.value, max: ADMIN_NOTE_LIMITS.MAX }}
      label={LABELS.priceChangeReason}
      hint={LABELS.priceChangeReasonHint}
      error={reason.error}
      required
    >
      <Textarea
        value={reason.value}
        maxLength={ADMIN_NOTE_LIMITS.MAX}
        disabled={disabled}
        className={productEditorFormStyles.policyTextarea}
        onChange={handleChange}
      />
    </FormFieldFrame>
  );
}
