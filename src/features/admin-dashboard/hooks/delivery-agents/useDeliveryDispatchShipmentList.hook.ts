import { useEffect, useState, useCallback, useMemo } from "react";
import {
  deliveryAdminApi,
  type UnassignedShipment,
} from "@/features/delivery-dashboard";
import { groupByPincodeZone } from "../../utils/delivery-agents/pincodeZoneGrouping";

type RunFn = (action: () => Promise<unknown>, success: string) => Promise<void>;

interface UseDeliveryDispatchShipmentListProps {
  selectedAgent: string;
  run: RunFn;
}

export function useDeliveryDispatchShipmentList({
  selectedAgent,
  run,
}: UseDeliveryDispatchShipmentListProps) {
  const [shipments, setShipments] = useState<UnassignedShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const load = useCallback(() => {
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback((id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  }, []);

  const dispatchSelected = useCallback(() => {
    if (!selectedAgent || selectedIds.length === 0) return;
    void run(
      () => deliveryAdminApi.bulkAssignShipments(selectedIds, selectedAgent),
      `${selectedIds.length} shipment(s) assigned.`,
    ).then(() => {
      setSelectedIds([]);
      load();
    });
  }, [selectedAgent, selectedIds, run, load]);

  const allIds = useMemo(() => shipments.map((s) => s.id), [shipments]);

  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? allIds : []);
    },
    [allIds],
  );

  const groups = useMemo(() => groupByPincodeZone(shipments), [shipments]);

  return {
    shipments,
    loading,
    selectedIds,
    toggle,
    dispatchSelected,
    allSelected,
    toggleSelectAll,
    groups,
    isAssignDisabled: !selectedAgent || selectedIds.length === 0,
  };
}
