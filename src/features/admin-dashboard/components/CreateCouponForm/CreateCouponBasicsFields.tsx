"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CouponFormInput } from "../../schemas/coupons.schema";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DateTimePicker } from "@/shared/components/DateTimePicker";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { DISCOUNT_BEARER } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/cn";
import { COUPON_TYPES } from "./constants";

interface CreateCouponBasicsFieldsProps {
  form: UseFormReturn<CouponFormInput>;
  showError: (name: keyof CouponFormInput) => string | undefined;
  hasError: (name: keyof CouponFormInput) => boolean;
  vendorMode: boolean;
  hideCodeField: boolean;
}

export function CreateCouponBasicsFields({
  form,
  showError,
  hasError,
  vendorMode,
  hideCodeField,
}: CreateCouponBasicsFieldsProps) {
  const { register, control } = form;

  return (
    <FormSection title={LABELS.couponSectionBasics} columns={1}>
      {!hideCodeField ? (
        <FormFieldFrame
          label={LABELS.couponCode}
          htmlFor="coupon-code"
          required
          error={showError("code")}
        >
          <Input
            id="coupon-code"
            error={hasError("code")}
            placeholder={LABELS.couponCode}
            {...register("code")}
          />
        </FormFieldFrame>
      ) : null}

      <FormFieldFrame
        label={LABELS.couponType}
        required
        error={showError("type")}
      >
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={cn(hasError("type") && "border-danger")}
              >
                <SelectValue placeholder={LABELS.couponType} />
              </SelectTrigger>
              <SelectContent>
                {COUPON_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.discountBearer}
        required
        error={showError("discountBearer")}
      >
        {vendorMode ? (
          <Input value={LABELS.discountBearerVendor} disabled readOnly />
        ) : (
          <Controller
            name="discountBearer"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(hasError("discountBearer") && "border-danger")}
                >
                  <SelectValue placeholder={LABELS.discountBearer} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DISCOUNT_BEARER.PLATFORM}>
                    {LABELS.discountBearerPlatform}
                  </SelectItem>
                  <SelectItem value={DISCOUNT_BEARER.VENDOR}>
                    {LABELS.discountBearerVendor}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        )}
      </FormFieldFrame>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldFrame
          label={LABELS.startDate}
          required
          error={showError("startDate")}
        >
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                value={field.value}
                onChange={(iso) => {
                  field.onChange(iso);
                  field.onBlur();
                }}
                error={hasError("startDate")}
              />
            )}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.endDate}
          required
          error={showError("endDate")}
        >
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                value={field.value}
                onChange={(iso) => {
                  field.onChange(iso);
                  field.onBlur();
                }}
                error={hasError("endDate")}
              />
            )}
          />
        </FormFieldFrame>
      </div>
    </FormSection>
  );
}
