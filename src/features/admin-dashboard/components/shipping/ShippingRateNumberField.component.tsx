"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { sanitizeNumericText } from "@/shared/utils/validation/sanitizeNumericInput";

interface ShippingRateNumberFieldProps {
  label: string;
  htmlFor: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Shared numeric field for the shipping-rate create form (weight/price/days inputs). */
export function ShippingRateNumberField({
  label,
  htmlFor,
  value,
  onChange,
  placeholder,
}: ShippingRateNumberFieldProps) {
  // type="text" + inputMode keeps mobile numeric keyboards without the
  // scroll-wheel/`e` pitfalls of type="number"; non-numeric input is stripped.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(sanitizeNumericText(event.target.value, { allowDecimal: true }));
  };

  return (
    <FormFieldFrame label={label} htmlFor={htmlFor}>
      <Input
        id={htmlFor}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </FormFieldFrame>
  );
}
