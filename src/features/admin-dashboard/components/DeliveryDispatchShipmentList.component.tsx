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

  useEffect(load, []);

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
    <div className="space-y-2 rounded-md border border-line p-3">
      <div className="flex items-center justify-between">
        <p className="text-body-sm font-medium text-ink">
          Unassigned shipments
        </p>
        <Button
          size="sm"
          disabled={!selectedAgent || selectedIds.length === 0}
          loading={pending}
          onClick={() => void dispatchSelected()}
        >
          <PackageCheck className="size-4" aria-hidden="true" />
          Assign {selectedIds.length || ""}
        </Button>
      </div>
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {loading ? (
          <p className="text-body-sm text-ink-muted">Loading shipments...</p>
        ) : shipments.length === 0 ? (
          <p className="text-body-sm text-ink-muted">
            No unassigned shipments.
          </p>
        ) : (
          <>
            <label className="flex items-center gap-2 rounded-sm border-b border-line/60 px-1 pb-1.5 text-body-sm">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
              />
              <span className="font-medium text-ink-muted">Select all</span>
            </label>
            {groups.map((group) => (
              <div key={group.zone}>
                <p className="px-1 pt-2 pb-1 text-caption font-medium uppercase tracking-wide text-ink-muted">
                  {formatLabel(deliveryDispatchZoneLabels.zoneGroupHeader, {
                    zone: group.zone,
                    count: group.rows.length,
                  })}
                </p>
                {group.rows.map((shipment) => (
                  <label
                    key={shipment.id}
                    className="flex items-center gap-2 rounded-sm px-1 py-1.5 text-body-sm hover:bg-paper/60"
                  >
                    <Checkbox
                      checked={selectedIds.includes(shipment.id)}
                      onCheckedChange={(checked) =>
                        toggle(shipment.id, Boolean(checked))
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
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
