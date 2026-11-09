"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type {
  CouponFormInput,
  CouponLockedField,
} from "../../../schemas/coupons/coupons.schema";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { DISCOUNT_BEARER } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/dom/cn";
import { COUPON_TYPES } from "../../../constants/coupons/constants";
import { createCouponFormStyles } from "../../../styles/coupons/createCouponForm.styles";
import { ControlledDateTimePicker } from "./ControlledFields.component";

interface CreateCouponBasicsFieldsProps {
  form: UseFormReturn<CouponFormInput>;
  showError: (name: keyof CouponFormInput) => string | undefined;
  hasError: (name: keyof CouponFormInput) => boolean;
  vendorMode: boolean;
  hideCodeField: boolean;
  lockedFields: readonly CouponLockedField[];
}

export function CreateCouponBasicsFields({
  form,
  showError,
  hasError,
  vendorMode,
  hideCodeField,
  lockedFields,
}: CreateCouponBasicsFieldsProps) {
  const { register, control } = form;
  const codeLocked = lockedFields.includes("code");
  const typeLocked = lockedFields.includes("type");
  const bearerLocked = lockedFields.includes("discountBearer");

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
            disabled={codeLocked}
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
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={typeLocked}
            >
              <SelectTrigger
                className={cn(
                  hasError("type") && createCouponFormStyles.borderDanger,
                )}
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
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={bearerLocked}
              >
                <SelectTrigger
                  className={cn(
                    hasError("discountBearer") &&
                      createCouponFormStyles.borderDanger,
                  )}
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

      <div className={createCouponFormStyles.gridSm2}>
        <FormFieldFrame
          label={LABELS.startDate}
          required
          error={showError("startDate")}
        >
          <ControlledDateTimePicker
            form={form}
            name="startDate"
            error={hasError("startDate")}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.endDate}
          required
          error={showError("endDate")}
        >
          <ControlledDateTimePicker
            form={form}
            name="endDate"
            error={hasError("endDate")}
          />
        </FormFieldFrame>
      </div>
    </FormSection>
  );
}
