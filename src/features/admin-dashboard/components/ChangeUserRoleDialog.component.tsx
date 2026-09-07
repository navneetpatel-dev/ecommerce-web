"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "../api/users.api.hook";
import { adminUserKeys } from "../api/users.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { vendorsApi } from "@/features/vendors";
import { ROLES } from "@/shared/constants/labels";

interface ChangeUserRoleDialogProps {
  userId: string;
  userName: string;
  currentRoleName: string;
  currentVendorId?: string | null;
  trigger?: React.ReactNode;
}

export function ChangeUserRoleDialog({
  userId,
  userName,
  currentRoleName,
  currentVendorId,
  trigger,
}: ChangeUserRoleDialogProps) {
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

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="inline-block cursor-pointer"
      >
        {trigger ?? (
          <Button size="sm" variant="outline">
            Change Role
          </Button>
        )}
      </span>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-ink-primary" />
              Change User Role
            </DialogTitle>
            <DialogDescription>
              Update role and permission access for {userName}. Current role:{" "}
              <strong>{currentRoleName}</strong>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-3 py-2">
            <label className="text-body-xs font-semibold text-ink-muted">
              Select New Role
            </label>
            {rolesQuery.isLoading ? (
              <p className="text-body-sm text-ink-muted">Loading roles...</p>
            ) : (
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full rounded border border-line bg-surface p-2 text-body-sm text-ink outline-none focus:border-brand"
              >
                <option value="">-- Select a role --</option>
                {rolesQuery.data?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}{" "}
                    {role.name === currentRoleName ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            )}

            {isVendorRole && (
              <div className="space-y-1.5 pt-2">
                <label className="text-body-xs font-semibold text-ink-muted">
                  Select Associated Vendor Store
                </label>
                {vendorsQuery.isLoading ? (
                  <p className="text-body-sm text-ink-muted">
                    Loading vendor stores...
                  </p>
                ) : (
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full rounded border border-line bg-surface p-2 text-body-sm text-ink outline-none focus:border-brand"
                  >
                    <option value="">-- Select a vendor store --</option>
                    {vendorsQuery.data?.items?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.businessName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                !selectedRoleId ||
                (isVendorRole && !selectedVendorId) ||
                mutation.isPending
              }
            >
              {mutation.isPending ? "Updating..." : "Save Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
