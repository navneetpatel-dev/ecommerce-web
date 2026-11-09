"use client";

import {
  Controller,
  type ControllerRenderProps,
  type UseFormReturn,
} from "react-hook-form";
import { DateTimePicker } from "@/shared/components/DateTimePicker";
import { CheckboxField } from "@/shared/components/forms/CheckboxField.component";
import {
  NumberInput,
  type NumberInputProps,
} from "@/shared/components/forms/NumberInput.component";
import { Switch } from "@/shared/components/ui/switch";
import { CouponScopeMultiSelect } from "../coupons/CouponScopeMultiSelect.component";
import type { CashbackOfferFormValues } from "../../schemas/cashback-offers/cashbackOfferForm.schema";

type Form = UseFormReturn<CashbackOfferFormValues>;
type NumberName = "percent" | "maxCashback" | "minOrderValue";
type DateName = "startsAt" | "endsAt";

interface OfferNumberProps extends Omit<
  NumberInputProps,
  "value" | "onChange" | "onBlur" | "form"
> {
  form: Form;
  name: NumberName;
}

/** RHF-bound number field; empty stays undefined (e.g. no cap). */
export function OfferNumberInput({
  form,
  name,
  ...inputProps
}: OfferNumberProps) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <BoundNumber field={field} inputProps={inputProps} />
      )}
    />
  );
}

function BoundNumber({
  field,
  inputProps,
}: {
  field: ControllerRenderProps<CashbackOfferFormValues, NumberName>;
  inputProps: Omit<NumberInputProps, "value" | "onChange" | "onBlur">;
}) {
  return (
    <NumberInput
      {...inputProps}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
  );
}

export function OfferDateTimePicker({
  form,
  name,
  id,
  error,
}: {
  form: Form;
  name: DateName;
  id: string;
  error?: boolean;
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => <BoundDate field={field} id={id} error={error} />}
    />
  );
}

function BoundDate({
  field,
  id,
  error,
}: {
  field: ControllerRenderProps<CashbackOfferFormValues, DateName>;
  id: string;
  error?: boolean;
}) {
  const handleChange = (iso: string) => {
    field.onChange(iso);
    field.onBlur();
  };
  return (
    <DateTimePicker
      id={id}
      mode="datetime"
      value={field.value || undefined}
      onChange={handleChange}
      error={error}
    />
  );
}

export function OfferCategoriesField({
  form,
  error,
}: {
  form: Form;
  error?: boolean;
}) {
  return (
    <Controller
      name="categoryIds"
      control={form.control}
      render={({ field }) => (
        <CouponScopeMultiSelect
          scopeType="category"
          value={field.value}
          onChange={field.onChange}
          error={error}
        />
      )}
    />
  );
}

export function OfferActiveSwitch({ form, id }: { form: Form; id: string }) {
  return (
    <Controller
      name="isActive"
      control={form.control}
      render={({ field }) => (
        <Switch
          id={id}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )}
    />
  );
}

export function OfferPaymentMethodField({
  form,
  method,
  label,
}: {
  form: Form;
  method: CashbackOfferFormValues["paymentMethods"][number];
  label: string;
}) {
  return (
    <Controller
      name="paymentMethods"
      control={form.control}
      render={({ field }) => (
        <BoundPaymentMethod field={field} method={method} label={label} />
      )}
    />
  );
}

function BoundPaymentMethod({
  field,
  method,
  label,
}: {
  field: ControllerRenderProps<CashbackOfferFormValues, "paymentMethods">;
  method: CashbackOfferFormValues["paymentMethods"][number];
  label: string;
}) {
  const handleChange = (checked: boolean) =>
    field.onChange(
      checked
        ? [...field.value.filter((value) => value !== method), method]
        : field.value.filter((value) => value !== method),
    );
  return (
    <CheckboxField
      id={`cashback-offer-pay-${method}`}
      checked={field.value.includes(method)}
      onCheckedChange={handleChange}
      label={label}
    />
  );
}
