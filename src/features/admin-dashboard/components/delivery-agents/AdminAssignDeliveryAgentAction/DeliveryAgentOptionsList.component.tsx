"use client";

import { SelectItem } from "@/shared/components/ui/select";
import type { DeliveryAgent } from "@/features/delivery-dashboard";

interface DeliveryAgentOptionsListProps {
  agents: DeliveryAgent[];
}

export function DeliveryAgentOptionsList({
  agents,
}: DeliveryAgentOptionsListProps) {
  return (
    <>
      {agents.map((agent) => (
        <SelectItem key={agent.id} value={agent.id}>
          {agent.fullName} · {agent.hubOrZone}
        </SelectItem>
      ))}
    </>
  );
}
