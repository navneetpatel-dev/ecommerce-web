import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { adminKeys } from "../api/admin.queries";

export function useProductModeration() {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveProduct(id),
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
