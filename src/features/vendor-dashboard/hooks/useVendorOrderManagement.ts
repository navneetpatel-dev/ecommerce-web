import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subOrdersApi } from "@/features/orders";
import { vendorKeys } from "../api/vendor.queries";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

interface SubOrderStatusInput {
  id: string;
  status: string;
  trackingId?: string;
}

/**
 * Vendor order management data (Rule 12): sub-order listing plus guarded
 * status updates with surfaced errors.
 */
export function useVendorOrderManagement() {
  const [page] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vendorKeys.suborders.all }),
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  return {
    data,
    isLoading,
    updatingId,
    setUpdatingId,
    handleStatusChange,
    isPending: updateStatus.isPending,
    statusError: updateStatus.isError
      ? getApiErrorMessage(updateStatus.error, LABELS.couldNotUpdateOrderStatus)
      : null,
  };
}
