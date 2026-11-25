import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import {
  adminShippingApi,
  adminShippingKeys,
  type RtoQueueShipment,
} from "../../api/shipping/shipping.api";
import { buildRtoQueueColumns } from "../../utils/shipping/rtoQueueColumns";

/** Parcels returning to the seller, and confirming one is back. */
export function useRtoQueuePanel() {
  const queryClient = useQueryClient();
  // The RTO endpoints are order-management actions, not shipping configuration.
  const visible = usePermissions().hasPermission(PERMISSIONS.ORDER_MANAGE);
  const query = useQuery({
    queryKey: adminShippingKeys.rtoQueue,
    queryFn: adminShippingApi.rtoShipments,
    enabled: visible,
  });
  const shipments: RtoQueueShipment[] = useMemo(
    () => query.data ?? [],
    [query.data],
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const filteredShipments = useMemo(() => {
    return shipments.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const trackingMatch = item.trackingNumber?.toLowerCase().includes(q);
        const customerMatch = item.subOrder?.order?.user?.name
          ?.toLowerCase()
          .includes(q);
        const reasonMatch = item.failureReason?.toLowerCase().includes(q);
        const subOrderIdMatch = item.subOrder?.id?.toLowerCase().includes(q);
        const orderIdMatch = item.subOrder?.order?.id
          ?.toLowerCase()
          .includes(q);
        if (
          !trackingMatch &&
          !customerMatch &&
          !reasonMatch &&
          !subOrderIdMatch &&
          !orderIdMatch
        ) {
          return false;
        }
      }
      return true;
    });
  }, [shipments, debouncedSearch, statusFilter]);

  const onClearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("ALL");
  }, []);

  const markReceived = useMutation({
    mutationFn: (shipmentId: string) =>
      adminShippingApi.updateShipmentStatus(shipmentId, {
        status: "RTO_DELIVERED",
      }),
    onSuccess: () => notifySuccess(LABELS.shipmentStatusUpdated),
    onError: (error) =>
      notifyError(getApiErrorMessage(error, LABELS.shipmentStatusUpdateFailed)),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: adminShippingKeys.rtoQueue }),
  });

  const handleMarkReceived = useCallback(
    (shipmentId: string) => markReceived.mutate(shipmentId),
    [markReceived],
  );

  const pendingShipmentId = markReceived.isPending
    ? (markReceived.variables ?? null)
    : null;

  const columns = useMemo(
    () => buildRtoQueueColumns(pendingShipmentId, handleMarkReceived),
    [pendingShipmentId, handleMarkReceived],
  );

  const pendingCount = useMemo(
    () => shipments.filter((s) => s.status === "RTO_INITIATED").length,
    [shipments],
  );

  return {
    visible,
    shipments,
    filteredShipments,
    columns,
    loading: query.isLoading,
    pendingCount,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onClearFilters,
    pendingBadge:
      pendingCount > 0
        ? formatLabel(LABELS.rtoAwaitingReceiptBadge, { count: pendingCount })
        : null,
  };
}
