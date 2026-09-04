"use client";

import { useEffect, useState } from "react";
import { PackageCheck, RotateCcw } from "lucide-react";
import {
  deliveryAdminApi,
  type DeliveryAgent,
  type UnassignedPickup,
  type UnassignedShipment,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [pickups, setPickups] = useState<UnassignedPickup[]>([]);
  const [loadingPickups, setLoadingPickups] = useState(true);
  const [returnId, setReturnId] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadShipments = () => {
    setLoadingShipments(true);
    deliveryAdminApi
      .unassignedShipments()
      .then((rows) => {
        setShipments(rows);
        setSelectedShipmentIds((current) =>
          current.filter((id) => rows.some((row) => row.id === id)),
        );
      })
      .catch(() => setShipments([]))
      .finally(() => setLoadingShipments(false));
  };

  const loadPickups = () => {
    setLoadingPickups(true);
    deliveryAdminApi
      .unassignedPickups()
      .then(setPickups)
      .catch(() => setPickups([]))
      .finally(() => setLoadingPickups(false));
  };

  useEffect(() => {
    loadShipments();
    loadPickups();
  }, []);

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

  const toggleShipment = (id: string, checked: boolean) => {
    setSelectedShipmentIds((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  const dispatchSelectedShipments = () =>
    run(
      () =>
        deliveryAdminApi.bulkAssignShipments(
          selectedShipmentIds,
          selectedAgent,
        ),
      `${selectedShipmentIds.length} shipment(s) assigned.`,
    ).then(() => {
      setSelectedShipmentIds([]);
      loadShipments();
    });

  const allShipmentIds = shipments.map((s) => s.id);
  const allSelected =
    allShipmentIds.length > 0 &&
    allShipmentIds.every((id) => selectedShipmentIds.includes(id));
  const toggleSelectAll = (checked: boolean) => {
    setSelectedShipmentIds(checked ? allShipmentIds : []);
  };

  return (
    <section className="space-y-4 border-b border-line pb-6">
      <div>
        <h2 className="font-display text-[1.125rem] text-ink">
          Manual dispatch
        </h2>
        <p className="mt-1 text-body-sm text-ink-muted">
          Select an agent, then check one or more waiting shipments (or pick a
          pending return pickup) to assign.
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
        <div className="space-y-2 rounded-md border border-line p-3">
          <div className="flex items-center justify-between">
            <p className="text-body-sm font-medium text-ink">
              Unassigned shipments
            </p>
            <Button
              size="sm"
              disabled={!selectedAgent || selectedShipmentIds.length === 0}
              loading={pending}
              onClick={() => void dispatchSelectedShipments()}
            >
              <PackageCheck className="size-4" aria-hidden="true" />
              Assign {selectedShipmentIds.length || ""}
            </Button>
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {loadingShipments ? (
              <p className="text-body-sm text-ink-muted">
                Loading shipments...
              </p>
            ) : shipments.length === 0 ? (
              <p className="text-body-sm text-ink-muted">
                No unassigned shipments.
              </p>
            ) : (
              <>
                <label className="flex items-center gap-2 rounded-sm border-b border-line/60 px-1 pb-1.5 text-body-sm">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      toggleSelectAll(Boolean(checked))
                    }
                  />
                  <span className="font-medium text-ink-muted">Select all</span>
                </label>
                {shipments.map((shipment) => (
                  <label
                    key={shipment.id}
                    className="flex items-center gap-2 rounded-sm px-1 py-1.5 text-body-sm hover:bg-paper/60"
                  >
                    <Checkbox
                      checked={selectedShipmentIds.includes(shipment.id)}
                      onCheckedChange={(checked) =>
                        toggleShipment(shipment.id, Boolean(checked))
                      }
                    />
                    <span className="min-w-0 flex-1 truncate font-mono">
                      {shipment.trackingNumber}
                    </span>
                    {shipment.vendorName ? (
                      <span className="shrink-0 text-ink-muted">
                        {shipment.vendorName}
                      </span>
                    ) : null}
                  </label>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-md border border-line p-3">
          <p className="text-body-sm font-medium text-ink">
            Unassigned return pickups
          </p>
          <div className="flex gap-2">
            <Select value={returnId} onValueChange={setReturnId}>
              <SelectTrigger className="min-w-0 flex-1">
                <SelectValue
                  placeholder={
                    loadingPickups
                      ? "Loading pickups..."
                      : pickups.length === 0
                        ? "No unassigned pickups"
                        : "Select a return pickup"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {pickups.map((pickup) => (
                  <SelectItem key={pickup.id} value={pickup.id}>
                    {pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`}
                    {pickup.customerName ? ` · ${pickup.customerName}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              aria-label="Assign return pickup"
              disabled={!selectedAgent || !returnId}
              loading={pending}
              onClick={() =>
                void run(
                  () => deliveryAdminApi.assignPickup(returnId, selectedAgent),
                  "Return pickup assigned.",
                ).then(() => {
                  setReturnId("");
                  loadPickups();
                })
              }
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Assign
            </Button>
          </div>
        </div>
      </div>

      {message ? <p className="text-body-sm text-success">{message}</p> : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </section>
  );
}
