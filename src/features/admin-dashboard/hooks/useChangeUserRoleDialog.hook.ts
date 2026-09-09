"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "../api/users.api.hook";
import { adminUserKeys } from "../api/users.queries";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { vendorsApi } from "@/features/vendors";
import { ROLES } from "@/shared/constants/labels";

interface UseChangeUserRoleDialogInput {
  userId: string;
  currentVendorId?: string | null;
}

/** Owns the change-user-role dialog's open state, role/vendor queries, and save mutation. */
export function useChangeUserRoleDialog({
  userId,
  currentVendorId,
}: UseChangeUserRoleDialogInput) {
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState(
    currentVendorId ?? "",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ["admin", "roles", "list"],
    queryFn: () => adminUsersApi.listRoles(),
    enabled: open,
  });

  const selectedRole = rolesQuery.data?.find((r) => r.id === selectedRoleId);
  const isVendorRole =
    selectedRole?.name === ROLES.VENDOR_OWNER ||
    selectedRole?.name === ROLES.VENDOR_STAFF;

  const vendorsQuery = useQuery({
    queryKey: ["admin", "vendors", "directory"],
    queryFn: () => vendorsApi.directory({ limit: 100 }),
    enabled: open && isVendorRole,
  });

  const mutation = useMutation({
    mutationFn: (body: { roleId: string; vendorId?: string | null }) =>
      adminUsersApi.updateRole(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      setOpen(false);
      setErrorMsg(null);
    },
    onError: (err: unknown) => {
      setErrorMsg(getApiErrorMessage(err, "Failed to update user role"));
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setErrorMsg(null);
      setSelectedRoleId("");
      setSelectedVendorId(currentVendorId ?? "");
    }
  };

  const handleSave = () => {
    if (!selectedRoleId) return;
    if (isVendorRole && !selectedVendorId) {
      setErrorMsg("Please select a vendor store for this role");
      return;
    }
    mutation.mutate({
      roleId: selectedRoleId,
      vendorId: isVendorRole ? selectedVendorId : null,
    });
  };

  return {
    open,
    setOpen,
    selectedRoleId,
    setSelectedRoleId,
    selectedVendorId,
    setSelectedVendorId,
    errorMsg,
    rolesQuery,
    vendorsQuery,
    isVendorRole,
    mutation,
    handleOpenChange,
    handleSave,
  };
}
