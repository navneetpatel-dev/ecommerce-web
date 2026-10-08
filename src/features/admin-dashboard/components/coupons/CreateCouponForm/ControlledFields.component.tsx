"use client";

import {
  Controller,
  type ControllerRenderProps,
  type UseFormReturn,
} from "react-hook-form";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import { DateTimePicker } from "@/shared/components/DateTimePicker";
import type { ComponentProps } from "react";
import {
  NumberInput,
  type NumberInputProps,
} from "@/shared/components/forms/NumberInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

/** Numeric coupon-form fields that render through `NumberInput`. */
type NumberFieldName =
  | "value"
  | "maxDiscountCap"
  | "tier2MinSubtotal"
  | "tier2Percent"
  | "minOrderValue"
  | "minQuantity"
  | "usageLimitTotal"
  | "usageLimitPerUser"
  | "priority";

interface ControlledNumberInputProps extends Omit<
  NumberInputProps,
  "value" | "onChange" | "onBlur" | "form"
> {
  form: UseFormReturn<CouponFormInput>;
  name: NumberFieldName;
  /** Used for display and commits when the field is empty (e.g. priority → 0). */
  emptyValue?: number;
}

/**
 * RHF-bound coupon number field. The Controller wiring lives in a child
 * component so call sites stay free of inline handlers.
 */
export function ControlledNumberInput({
  form,
  name,
  emptyValue,
  ...inputProps
}: ControlledNumberInputProps) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <BoundNumberInput
          field={field}
          emptyValue={emptyValue}
          inputProps={inputProps}
        />
      )}
    />
  );
}

function BoundNumberInput({
  field,
  emptyValue,
  inputProps,
}: {
  field: ControllerRenderProps<CouponFormInput, NumberFieldName>;
  emptyValue?: number;
  inputProps: Omit<NumberInputProps, "value" | "onChange" | "onBlur">;
}) {
  const handleChange = (value: number | undefined) =>
    field.onChange(value ?? emptyValue);

  return (
    <NumberInput
      {...inputProps}
      value={field.value ?? emptyValue}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
}

/** Stackable boolean exposed as a Yes/No select, bound to RHF. */
export function ControlledStackableSelect({
  form,
}: {
  form: UseFormReturn<CouponFormInput>;
}) {
  return (
    <Controller
      name="stackable"
      control={form.control}
      render={({ field }) => <BoundStackableSelect field={field} />}
    />
  );
}

function BoundStackableSelect({
  field,
}: {
  field: ControllerRenderProps<CouponFormInput, "stackable">;
}) {
  const handleChange = (next: string) => field.onChange(next === "true");

  return (
    <Select value={field.value ? "true" : "false"} onValueChange={handleChange}>
      <SelectTrigger id="coupon-stackable">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="false">{LABELS.no}</SelectItem>
        <SelectItem value="true">{LABELS.yes}</SelectItem>
      </SelectContent>
    </Select>
  );
}

/** Coupon start/end date-time fields, bound to RHF. */
type DateTimeFieldName = "startDate" | "endDate";
type DateTimePickerProps = ComponentProps<typeof DateTimePicker>;

interface ControlledDateTimePickerProps extends Omit<
  DateTimePickerProps,
  "value" | "onChange"
> {
  form: UseFormReturn<CouponFormInput>;
  name: DateTimeFieldName;
}

export function ControlledDateTimePicker({
  form,
  name,
  ...pickerProps
}: ControlledDateTimePickerProps) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <BoundDateTimePicker field={field} pickerProps={pickerProps} />
      )}
    />
  );
}

function BoundDateTimePicker({
  field,
  pickerProps,
}: {
  field: ControllerRenderProps<CouponFormInput, DateTimeFieldName>;
  pickerProps: Omit<DateTimePickerProps, "value" | "onChange">;
}) {
  const handleChange = (iso: string) => {
    field.onChange(iso);
    field.onBlur();
  };

  return (
    <DateTimePicker
      {...pickerProps}
      value={field.value}
      onChange={handleChange}
    />
  );
}
