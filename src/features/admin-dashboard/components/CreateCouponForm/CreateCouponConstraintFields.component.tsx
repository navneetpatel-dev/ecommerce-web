"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CouponFormInput } from "../../schemas/coupons.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";

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
  const { control } = form;

  return (
    <FormSection title={LABELS.couponSectionConstraints} columns={1}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldFrame
          label={LABELS.minOrderValue}
          error={showError("minOrderValue")}
        >
          <Controller
            name="minOrderValue"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? undefined}
                min={0}
                step={50}
                prefix="₹"
                error={hasError("minOrderValue")}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.minQuantity}
          error={showError("minQuantity")}
        >
          <Controller
            name="minQuantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? undefined}
                min={0}
                step={1}
                error={hasError("minQuantity")}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldFrame
          label={LABELS.usageLimitTotal}
          error={showError("usageLimitTotal")}
        >
          <Controller
            name="usageLimitTotal"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? undefined}
                min={1}
                step={1}
                error={hasError("usageLimitTotal")}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.usageLimitPerUser}
          error={showError("usageLimitPerUser")}
        >
          <Controller
            name="usageLimitPerUser"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? undefined}
                min={1}
                step={1}
                error={hasError("usageLimitPerUser")}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldFrame label={LABELS.priority} error={showError("priority")}>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value ?? 0}
                step={1}
                error={hasError("priority")}
                onChange={(value) => field.onChange(value ?? 0)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.stackable}
          hint={LABELS.stackableHint}
          htmlFor="coupon-stackable"
        >
          <Controller
            name="stackable"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(next) => field.onChange(next === "true")}
              >
                <SelectTrigger id="coupon-stackable">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">{LABELS.no}</SelectItem>
                  <SelectItem value="true">{LABELS.yes}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormFieldFrame>
      </div>
    </FormSection>
  );
}
