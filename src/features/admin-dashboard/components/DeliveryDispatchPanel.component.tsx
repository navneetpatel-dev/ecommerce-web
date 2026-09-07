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

import { Truck } from "lucide-react";

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
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="size-5 text-brand" aria-hidden="true" />
            <h2 className="font-display text-[1.125rem] font-semibold text-ink">
              Manual dispatch console
            </h2>
          </div>
          <p className="mt-1 text-body-sm text-ink-muted">
            Assign waiting shipments and return pickups to active on-duty
            agents. Grouped by pincode zone.
          </p>
        </div>

        <div className="w-full sm:w-72 shrink-0">
          <label className="text-caption font-medium text-ink-muted block mb-1">
            Dispatch target agent *
          </label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  available.length === 0
                    ? "No available agents"
                    : "Select available agent"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {available.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.fullName} · {agent.hubOrZone} ({agent.vehicleType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
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

      {message ? (
        <div className="rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-body-sm font-medium text-success">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger">
          {error}
        </div>
      ) : null}
    </section>
  );
}
