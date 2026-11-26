import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/analytics/admin.api";
import { adminKeys } from "../../api/analytics/admin.queries";

export function useProductModeration() {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: ({
      id,
      ownWorkReason,
    }: {
      id: string;
      ownWorkReason?: string;
    }) => adminApi.approveProduct(id, ownWorkReason),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.products.all }),
  });

  const reject = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      adminApi.rejectProduct(id, note),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.products.all }),
  });

  return { approve, reject };
}
