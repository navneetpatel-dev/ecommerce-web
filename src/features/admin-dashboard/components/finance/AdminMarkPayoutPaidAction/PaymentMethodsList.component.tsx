"use client";

import { SelectItem } from "@/shared/components/ui/select";
import type { PayoutPaymentMethod } from "@/shared/api/types";

interface PaymentMethodsListProps {
  methods: readonly PayoutPaymentMethod[];
}

export function PaymentMethodsList({ methods }: PaymentMethodsListProps) {
  return (
    <>
      {methods.map((value) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      ))}
    </>
  );
}
