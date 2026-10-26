import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnsApi } from "@/features/returns";
import { vendorKeys } from "../../api/overview/vendor.queries";

/** Restocks one picked-up return, then refreshes the vendor's returns list. */
export function useVendorReturnRestock(returnId: string) {
  const queryClient = useQueryClient();
  const restock = useMutation({
    mutationFn: () => returnsApi.restock(returnId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vendorKeys.returns.all }),
  });
  const handleRestock = () => restock.mutateAsync();
  return { handleRestock };
}
