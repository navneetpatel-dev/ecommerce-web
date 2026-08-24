import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { adminKeys } from "../api/admin.queries";

export function useVendorApproval() {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveVendor(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.vendors.all }),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectVendor(id, reason),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.vendors.all }),
  });

  return { approve, reject };
}
