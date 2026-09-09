"use client";

import { SelectItem } from "@/shared/components/ui/select";
import type { AgentPayoutPaymentMethod } from "@/features/delivery-dashboard";

interface AgentPaymentMethodsListProps {
  methods: readonly AgentPayoutPaymentMethod[];
}

export function AgentPaymentMethodsList({
  methods,
}: AgentPaymentMethodsListProps) {
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
