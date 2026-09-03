"use client";

import { useEffect, useState } from "react";
import { PackageCheck, RotateCcw } from "lucide-react";
import {
  deliveryAdminApi,
  type DeliveryAgent,
  type UnassignedShipment,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

export function DeliveryDispatchPanel({
  agents,
  onDispatched,
}: {
  agents: DeliveryAgent[];
  onDispatched: () => void;
}) {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [shipments, setShipments] = useState<UnassignedShipment[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [shipmentId, setShipmentId] = useState("");
  const [returnId, setReturnId] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadShipments = () => {
    setLoadingShipments(true);
    deliveryAdminApi
      .unassignedShipments()
      .then(setShipments)
      .catch(() => setShipments([]))
      .finally(() => setLoadingShipments(false));
  };

  useEffect(loadShipments, []);

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

  const dispatchShipment = () =>
    run(
      () => deliveryAdminApi.assignShipment(shipmentId, selectedAgent),
      "Shipment assigned.",
    ).then(() => {
      setShipmentId("");
      loadShipments();
    });

  return (
    <section className="space-y-4 border-b border-line pb-6">
      <div>
        <h2 className="font-display text-[1.125rem] text-ink">
          Manual dispatch
        </h2>
        <p className="mt-1 text-body-sm text-ink-muted">
          Pick a shipment waiting for an agent, or use the Assign agent action
          on a return record for pickups.
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
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex gap-2">
          <Select value={shipmentId} onValueChange={setShipmentId}>
            <SelectTrigger className="min-w-0 flex-1">
              <SelectValue
                placeholder={
                  loadingShipments
                    ? "Loading shipments..."
                    : shipments.length === 0
                      ? "No unassigned shipments"
                      : "Select a shipment"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {shipments.map((shipment) => (
                <SelectItem key={shipment.id} value={shipment.id}>
                  {shipment.trackingNumber}
                  {shipment.vendorName ? ` · ${shipment.vendorName}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            aria-label="Assign shipment"
            disabled={!selectedAgent || !shipmentId}
            loading={pending}
            onClick={() => void dispatchShipment()}
          >
            <PackageCheck className="size-4" aria-hidden="true" />
            Assign
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Return UUID"
            value={returnId}
            onChange={(event) => setReturnId(event.target.value)}
          />
          <Button
            aria-label="Assign return pickup"
            disabled={!selectedAgent || !returnId}
            loading={pending}
            onClick={() =>
              void run(
                () => deliveryAdminApi.assignPickup(returnId, selectedAgent),
                "Return pickup assigned.",
              )
            }
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Assign
          </Button>
        </div>
      </div>
      {message ? <p className="text-body-sm text-success">{message}</p> : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </section>
  );
}
