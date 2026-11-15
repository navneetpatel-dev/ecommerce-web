import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnsApi } from "@/features/returns";
import { vendorKeys } from "../../api/overview/vendor.queries";

export function useVendorReturnDispute(returnId: string) {
  const queryClient = useQueryClient();
  const dispute = useMutation({
    mutationFn: (body: {
      reason: string;
      description: string;
      evidenceUrls?: string[];
    }) => returnsApi.dispute(returnId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vendorKeys.returns.all }),
  });
  const handleDispute = (body: {
    reason: string;
    description: string;
    evidenceUrls?: string[];
  }) => dispute.mutateAsync(body);
  return { handleDispute, isSubmitting: dispute.isPending };
}
