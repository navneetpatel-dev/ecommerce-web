"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";

interface ShippingRateNumberFieldProps {
  label: string;
  htmlFor: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: string;
  placeholder?: string;
}

/** Shared numeric field for the shipping-rate create form (weight/price/days inputs). */
export function ShippingRateNumberField({
  label,
  htmlFor,
  value,
  onChange,
  min,
  step,
  placeholder,
}: ShippingRateNumberFieldProps) {
  return (
    <FormFieldFrame label={label} htmlFor={htmlFor}>
      <Input
        id={htmlFor}
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </FormFieldFrame>
  );
}
