import { useEffect, useState, useCallback, useMemo } from "react";
import {
  deliveryAdminApi,
  type UnassignedPickup,
} from "@/features/delivery-dashboard";
import { groupByPincodeZone } from "../../utils/pincodeZoneGrouping";

type RunFn = (action: () => Promise<unknown>, success: string) => Promise<void>;

interface UseDeliveryDispatchPickupListProps {
  selectedAgent: string;
  run: RunFn;
}

export function useDeliveryDispatchPickupList({
  selectedAgent,
  run,
}: UseDeliveryDispatchPickupListProps) {
  const [pickups, setPickups] = useState<UnassignedPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [returnId, setReturnId] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    deliveryAdminApi
      .unassignedPickups()
      .then(setPickups)
      .catch(() => setPickups([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => groupByPincodeZone(pickups), [pickups]);

  const handleAssign = useCallback(() => {
    if (!selectedAgent || !returnId) return;
    void run(
      () => deliveryAdminApi.assignPickup(returnId, selectedAgent),
      "Return pickup assigned.",
    ).then(() => {
      setReturnId("");
      load();
    });
  }, [selectedAgent, returnId, run, load]);

  const placeholder = loading
    ? "Loading pickups..."
    : pickups.length === 0
      ? "No unassigned pickups"
      : "Select a return pickup";

  return {
    pickups,
    loading,
    returnId,
    setReturnId,
    groups,
    handleAssign,
    placeholder,
    isAssignDisabled: !selectedAgent || !returnId,
  };
}
