import { useCallback } from "react";
import { adminApi } from "../../api/admin.api";

export function useVendorRowActionsHandlers(
  vendorId: string,
  onReload: () => void,
) {
  const handleUnsuspend = useCallback(async () => {
    await adminApi.unsuspendVendor(vendorId);
    onReload();
  }, [vendorId, onReload]);

  const handleSuspend = useCallback(
    async (reason?: string) => {
      await adminApi.suspendVendor(vendorId, reason ?? "");
      onReload();
    },
    [vendorId, onReload],
  );

  const handleDelete = useCallback(async () => {
    await adminApi.deleteVendor(vendorId);
    onReload();
  }, [vendorId, onReload]);

  return {
    handleUnsuspend,
    handleSuspend,
    handleDelete,
  };
}
