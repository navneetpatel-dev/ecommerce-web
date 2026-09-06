"use client";

import { useState } from "react";
import type { DeliveryAgent } from "@/features/delivery-dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { DeliveryDispatchShipmentList } from "./DeliveryDispatchShipmentList.component";
import { DeliveryDispatchPickupList } from "./DeliveryDispatchPickupList.component";

export function DeliveryDispatchPanel({
  agents,
  onDispatched,
}: {
  agents: DeliveryAgent[];
  onDispatched: () => void;
}) {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const available = agents.filter(
    (agent) => agent.status === "ACTIVE" && agent.availableForAssignment,
  );

  const run = async (action: () => Promise<unknown>, success: string) => {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(success);
      onDispatched();
    } catch (actionError) {
      setError(
        getApiErrorMessage(
          actionError,
          "Could not complete this dispatch action.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="space-y-4 border-b border-line pb-6">
      <div>
        <h2 className="font-display text-[1.125rem] text-ink">
          Manual dispatch
        </h2>
        <p className="mt-1 text-body-sm text-ink-muted">
          Select an agent, then check one or more waiting shipments (or pick a
          pending return pickup) to assign. Both lists are grouped by pincode
          zone so nearby tasks are easy to batch together.
        </p>
      </div>
      <Select value={selectedAgent} onValueChange={setSelectedAgent}>
        <SelectTrigger className="max-w-md">
          <SelectValue placeholder="Select available agent" />
        </SelectTrigger>
        <SelectContent>
          {available.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.fullName} · {agent.hubOrZone} ·{" "}
              {(agent.activeDeliveries ?? 0) + (agent.activePickups ?? 0)}{" "}
              active
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-4 md:grid-cols-2">
        <DeliveryDispatchShipmentList
          selectedAgent={selectedAgent}
          pending={pending}
          run={run}
        />
        <DeliveryDispatchPickupList
          selectedAgent={selectedAgent}
          pending={pending}
          run={run}
        />
      </div>

      {message ? <p className="text-body-sm text-success">{message}</p> : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </section>
  );
}
