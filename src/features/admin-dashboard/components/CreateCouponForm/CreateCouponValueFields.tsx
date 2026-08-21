"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CouponFormInput } from "../../schemas/coupons.schema";
import { NumberInput } from "@/shared/components/NumberInput";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";

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
  const { control } = form;

  return (
    <FormSection title={LABELS.couponSectionValue} columns={1}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldFrame
          label={LABELS.couponValue}
          required={needsValue}
          error={showError("value")}
        >
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? undefined}
                min={0}
                max={
                  type === "PERCENTAGE" || type === "TIERED" ? 100 : undefined
                }
                step={1}
                suffix={
                  type === "PERCENTAGE" || type === "TIERED" ? "%" : undefined
                }
                prefix={
                  type === "FLAT" || type === "CASHBACK" || type === "BUNDLE"
                    ? "₹"
                    : undefined
                }
                error={hasError("value")}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.maxDiscountCap}
          error={showError("maxDiscountCap")}
        >
          <Controller
            name="maxDiscountCap"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? undefined}
                min={0}
                step={10}
                prefix="₹"
                error={hasError("maxDiscountCap")}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
      </div>
      {isTiered ? (
        <div className="space-y-3">
          <p className="text-[0.8125rem] text-ink-muted">
            {LABELS.couponTierHint}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormFieldFrame label={LABELS.couponTier2Min}>
              <Controller
                name="tier2MinSubtotal"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value ?? undefined}
                    min={0}
                    step={50}
                    prefix="₹"
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.couponTier2Percent}>
              <Controller
                name="tier2Percent"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value ?? undefined}
                    min={0}
                    max={100}
                    step={1}
                    suffix="%"
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormFieldFrame>
          </div>
        </div>
      ) : null}
    </FormSection>
  );
}
