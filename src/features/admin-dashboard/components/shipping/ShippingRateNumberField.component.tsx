"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";

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
    const cleaned = event.target.value.replace(/[^0-9.]/g, "");
    const [whole, ...decimals] = cleaned.split(".");
    onChange(decimals.length ? `${whole}.${decimals.join("")}` : whole);
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
