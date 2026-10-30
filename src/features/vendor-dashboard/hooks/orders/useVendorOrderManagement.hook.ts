import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subOrdersApi } from "@/features/orders";
import type { PaginatedList } from "@/shared/api/client/pagination";
import { vendorKeys } from "../../api/overview/vendor.queries";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { VendorSubOrder } from "../../types/orders/vendorOrders.types";

interface SubOrderStatusInput {
  id: string;
  status: string;
  trackingId?: string;
}

/**
 * Vendor order management data (Rule 12): sub-order listing plus guarded
 * status updates with surfaced errors.
 */
function applyStatusToList(
  current: PaginatedList<VendorSubOrder> | undefined,
  updated: {
    id: string;
    status: string;
    taxInvoiceNumber?: string | null;
    shipment?: VendorSubOrder["shipment"];
  },
): PaginatedList<VendorSubOrder> | undefined {
  if (!current) return current;
  return {
    ...current,
    items: current.items.map((item) =>
      item.id === updated.id
        ? {
            ...item,
            status: updated.status,
            taxInvoiceNumber: updated.taxInvoiceNumber ?? item.taxInvoiceNumber,
            shipment: updated.shipment ?? item.shipment,
          }
        : item,
    ),
  };
}

export function useVendorOrderManagement() {
  const [page] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusErrorId, setStatusErrorId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: vendorKeys.suborders.page(page),
    queryFn: () => subOrdersApi.vendorSubOrders(page),
  });

  const updateStatus = useMutation({
    mutationFn: (input: SubOrderStatusInput) =>
      subOrdersApi.updateStatus(input.id, {
        status: input.status,
        trackingId: input.trackingId,
      }),
    onSuccess: (updated) => {
      setStatusErrorId(null);
      queryClient.setQueriesData<PaginatedList<VendorSubOrder>>(
        { queryKey: vendorKeys.suborders.all },
        (current) =>
          applyStatusToList(current, {
            id: updated.id,
            status: updated.status,
            taxInvoiceNumber: updated.taxInvoiceNumber,
            shipment: updated.shipment as VendorSubOrder["shipment"],
          }),
      );
      void queryClient.invalidateQueries({
        queryKey: vendorKeys.suborders.all,
      });
    },
    onError: (_error, input) => setStatusErrorId(input.id),
  });

  const handleStatusChange = (
    id: string,
    status: string,
    trackingId?: string,
  ) => {
    updateStatus.mutate(
      { id, status, trackingId },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  const statusError = updateStatus.isError
    ? getApiErrorMessage(updateStatus.error, LABELS.couldNotUpdateOrderStatus)
    : null;

  return {
    data,
    isLoading,
    updatingId,
    setUpdatingId,
    statusErrorId,
    handleStatusChange,
    isPending: updateStatus.isPending,
    statusError,
  };
}
