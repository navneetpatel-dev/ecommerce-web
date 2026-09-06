"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  deliveryAdminApi,
  type UnassignedPickup,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { deliveryDispatchZoneLabels } from "@/shared/constants/labels/deliveryDispatchZones";
import { formatLabel } from "@/shared/utils/formatLabel";
import { groupByPincodeZone } from "../utils/pincodeZoneGrouping";

type RunFn = (action: () => Promise<unknown>, success: string) => Promise<void>;

export function DeliveryDispatchPickupList({
  selectedAgent,
  pending,
  run,
}: {
  selectedAgent: string;
  pending: boolean;
  run: RunFn;
}) {
  const [pickups, setPickups] = useState<UnassignedPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [returnId, setReturnId] = useState("");

  const load = () => {
    setLoading(true);
    deliveryAdminApi
      .unassignedPickups()
      .then(setPickups)
      .catch(() => setPickups([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const groups = groupByPincodeZone(pickups);

  return (
    <div className="space-y-2 rounded-md border border-line p-3">
      <p className="text-body-sm font-medium text-ink">
        Unassigned return pickups
      </p>
      <div className="flex gap-2">
        <Select value={returnId} onValueChange={setReturnId}>
          <SelectTrigger className="min-w-0 flex-1">
            <SelectValue
              placeholder={
                loading
                  ? "Loading pickups..."
                  : pickups.length === 0
                    ? "No unassigned pickups"
                    : "Select a return pickup"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectGroup key={group.zone}>
                <SelectItem value={`__zone_${group.zone}__`} disabled>
                  {formatLabel(deliveryDispatchZoneLabels.zoneGroupHeader, {
                    zone: group.zone,
                    count: group.rows.length,
                  })}
                </SelectItem>
                {group.rows.map((pickup) => (
                  <SelectItem key={pickup.id} value={pickup.id}>
                    {pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`}
                    {pickup.customerName ? ` · ${pickup.customerName}` : ""}
                  </SelectItem>
                ))}
              </SelectGroup>
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
              load();
            })
          }
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Assign
        </Button>
      </div>
    </div>
  );
}
