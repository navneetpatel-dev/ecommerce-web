import { useEffect, useState, useCallback, useMemo } from "react";
import {
  deliveryAdminApi,
  type UnassignedPickup,
} from "@/features/delivery-dashboard";
import { groupByPincodeZone } from "../../utils/delivery-agents/pincodeZoneGrouping";

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
    deliveryAdminApi
      .unassignedPickups()
      .then(setPickups)
      .catch(() => setPickups([]))
      .finally(() => setLoading(false));
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

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
      reload();
    });
  }, [selectedAgent, returnId, run, reload]);

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
