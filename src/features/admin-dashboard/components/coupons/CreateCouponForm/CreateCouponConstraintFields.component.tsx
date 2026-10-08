"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { createCouponFormStyles } from "../../../styles/coupons/createCouponForm.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import {
  ControlledNumberInput,
  ControlledStackableSelect,
} from "./ControlledFields.component";

interface CreateCouponConstraintFieldsProps {
  form: UseFormReturn<CouponFormInput>;
  showError: (name: keyof CouponFormInput) => string | undefined;
  hasError: (name: keyof CouponFormInput) => boolean;
}

export function CreateCouponConstraintFields({
  form,
  showError,
  hasError,
}: CreateCouponConstraintFieldsProps) {
  return (
    <FormSection title={LABELS.couponSectionConstraints} columns={1}>
      <div className={createCouponFormStyles.gridSm2}>
        <FormFieldFrame
          label={LABELS.minOrderValue}
          error={showError("minOrderValue")}
        >
          <ControlledNumberInput
            form={form}
            name="minOrderValue"
            min={0}
            step={50}
            prefix={CURRENCY_SYMBOL}
            error={hasError("minOrderValue")}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.minQuantity}
          error={showError("minQuantity")}
        >
          <ControlledNumberInput
            form={form}
            name="minQuantity"
            min={0}
            step={1}
            error={hasError("minQuantity")}
          />
        </FormFieldFrame>
      </div>
      <div className={createCouponFormStyles.gridSm2}>
        <FormFieldFrame
          label={LABELS.usageLimitTotal}
          error={showError("usageLimitTotal")}
        >
          <ControlledNumberInput
            form={form}
            name="usageLimitTotal"
            min={1}
            step={1}
            error={hasError("usageLimitTotal")}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.usageLimitPerUser}
          error={showError("usageLimitPerUser")}
        >
          <ControlledNumberInput
            form={form}
            name="usageLimitPerUser"
            min={1}
            step={1}
            error={hasError("usageLimitPerUser")}
          />
        </FormFieldFrame>
      </div>
      <div className={createCouponFormStyles.gridSm2}>
        <FormFieldFrame label={LABELS.priority} error={showError("priority")}>
          <ControlledNumberInput
            form={form}
            name="priority"
            step={1}
            emptyValue={0}
            error={hasError("priority")}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.stackable}
          hint={LABELS.stackableHint}
          htmlFor="coupon-stackable"
        >
          <ControlledStackableSelect form={form} />
        </FormFieldFrame>
      </div>
    </FormSection>
  );
}
