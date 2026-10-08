"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import { createCouponFormStyles } from "../../../styles/coupons/createCouponForm.styles";
import { ControlledNumberInput } from "./ControlledFields.component";

interface CreateCouponValueFieldsProps {
  form: UseFormReturn<CouponFormInput>;
  showError: (name: keyof CouponFormInput) => string | undefined;
  hasError: (name: keyof CouponFormInput) => boolean;
  type: CouponFormInput["type"];
  needsValue: boolean;
  isTiered: boolean;
}

export function CreateCouponValueFields({
  form,
  showError,
  hasError,
  type,
  needsValue,
  isTiered,
}: CreateCouponValueFieldsProps) {
  return (
    <FormSection title={LABELS.couponSectionValue} columns={1}>
      <div className={createCouponFormStyles.gridSm2}>
        <FormFieldFrame
          label={LABELS.couponValue}
          hint={LABELS.couponValueGstHint}
          required={needsValue}
          error={showError("value")}
        >
          <ControlledNumberInput
            form={form}
            name="value"
            min={0}
            max={type === "PERCENTAGE" || type === "TIERED" ? 100 : undefined}
            step={1}
            suffix={
              type === "PERCENTAGE" || type === "TIERED" ? "%" : undefined
            }
            prefix={
              type === "FLAT" || type === "CASHBACK" || type === "BUNDLE"
                ? CURRENCY_SYMBOL
                : undefined
            }
            error={hasError("value")}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.maxDiscountCap}
          error={showError("maxDiscountCap")}
        >
          <ControlledNumberInput
            form={form}
            name="maxDiscountCap"
            min={0}
            step={10}
            prefix={CURRENCY_SYMBOL}
            error={hasError("maxDiscountCap")}
          />
        </FormFieldFrame>
      </div>
      {isTiered ? (
        <div className={createCouponFormStyles.stack3}>
          <p className={createCouponFormStyles.hintMuted}>
            {LABELS.couponTierHint}
          </p>
          <div className={createCouponFormStyles.gridSm2}>
            <FormFieldFrame label={LABELS.couponTier2Min}>
              <ControlledNumberInput
                form={form}
                name="tier2MinSubtotal"
                min={0}
                step={50}
                prefix={CURRENCY_SYMBOL}
              />
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.couponTier2Percent}>
              <ControlledNumberInput
                form={form}
                name="tier2Percent"
                min={0}
                max={100}
                step={1}
                suffix="%"
              />
            </FormFieldFrame>
          </div>
        </div>
      ) : null}
    </FormSection>
  );
}
