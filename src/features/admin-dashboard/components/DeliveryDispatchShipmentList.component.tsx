"use client";

import { useEffect, useState } from "react";
import { PackageCheck } from "lucide-react";
import {
  deliveryAdminApi,
  type UnassignedShipment,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { deliveryDispatchZoneLabels } from "@/shared/constants/labels/deliveryDispatchZones";
import { formatLabel } from "@/shared/utils/formatLabel";
import { groupByPincodeZone } from "../utils/pincodeZoneGrouping";

import { cn } from "@/shared/utils/cn";

type RunFn = (action: () => Promise<unknown>, success: string) => Promise<void>;

export function DeliveryDispatchShipmentList({
  selectedAgent,
  pending,
  run,
}: {
  selectedAgent: string;
  pending: boolean;
  run: RunFn;
}) {
  const [shipments, setShipments] = useState<UnassignedShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const load = () => {
    setLoading(true);
    deliveryAdminApi
      .unassignedShipments()
      .then((rows) => {
        setShipments(rows);
        setSelectedIds((current) =>
          current.filter((id) => rows.some((row) => row.id === id)),
        );
      })
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    deliveryAdminApi
      .unassignedShipments()
      .then((rows) => {
        setShipments(rows);
        setSelectedIds((current) =>
          current.filter((id) => rows.some((row) => row.id === id)),
        );
      })
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  const dispatchSelected = () =>
    run(
      () => deliveryAdminApi.bulkAssignShipments(selectedIds, selectedAgent),
      `${selectedIds.length} shipment(s) assigned.`,
    ).then(() => {
      setSelectedIds([]);
      load();
    });

  const allIds = shipments.map((s) => s.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? allIds : []);
  };

  const groups = groupByPincodeZone(shipments);

  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-elevation-1 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
        <div className="flex items-center gap-2">
          <p className="text-body font-medium text-ink">Unassigned shipments</p>
          {selectedIds.length > 0 ? (
            <span className="inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-caption font-semibold text-brand">
              {selectedIds.length} selected
            </span>
          ) : null}
        </div>
        <Button
          size="sm"
          disabled={!selectedAgent || selectedIds.length === 0}
          loading={pending}
          onClick={() => void dispatchSelected()}
        >
          <PackageCheck className="size-4" aria-hidden="true" />
          Assign {selectedIds.length ? `(${selectedIds.length})` : ""}
        </Button>
      </div>

      <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-body-sm text-ink-muted">Loading shipments...</p>
        ) : shipments.length === 0 ? (
          <p className="py-4 text-center text-body-sm text-ink-muted">
            No unassigned shipments waiting.
          </p>
        ) : (
          <>
            <label className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-body-sm font-medium text-ink-muted hover:bg-paper/40 cursor-pointer select-none transition-colors border-b border-line/40 pb-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
              />
              <span>Select all shipments ({shipments.length})</span>
            </label>
            {groups.map((group) => (
              <div key={group.zone} className="pt-2">
                <div className="mb-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded bg-paper/60 px-2 py-0.5 text-caption font-semibold uppercase tracking-wider text-ink-muted border border-line/40">
                    {formatLabel(deliveryDispatchZoneLabels.zoneGroupHeader, {
                      zone: group.zone,
                      count: group.rows.length,
                    })}
                  </span>
                </div>
                <div className="space-y-1">
                  {group.rows.map((shipment) => {
                    const isSelected = selectedIds.includes(shipment.id);
                    return (
                      <label
                        key={shipment.id}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2.5 py-2 text-body-sm transition-all cursor-pointer select-none border",
                          isSelected
                            ? "bg-brand/10 border-brand/40 text-ink shadow-xs"
                            : "border-transparent hover:bg-paper/60 text-ink hover:text-ink",
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            toggle(shipment.id, Boolean(checked))
                          }
                        />
                        <span className="min-w-0 flex-1 truncate font-mono text-body-sm font-medium">
                          {shipment.trackingNumber}
                        </span>
                        {shipment.vendorName ? (
                          <span className="shrink-0 text-caption font-medium rounded bg-paper/80 px-2 py-0.5 text-ink-muted border border-line/50">
                            {shipment.vendorName}
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
