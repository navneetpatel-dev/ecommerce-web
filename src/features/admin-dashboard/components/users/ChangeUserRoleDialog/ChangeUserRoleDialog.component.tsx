"use client";

import type { ReactNode } from "react";
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
import { changeUserRoleDialogStyles } from "../../../styles/users/changeUserRoleDialog.styles";
import { RoleOptionsList } from "./RoleOptionsList.component";
import { VendorOptionsList } from "./VendorOptionsList.component";
import { useChangeUserRoleDialogPresentation } from "../../../hooks/users/useChangeUserRoleDialogPresentation.hook";

export interface ChangeUserRoleDialogProps {
  userId: string;
  userName: string;
  currentRoleName: string;
  currentVendorId?: string | null;
  trigger?: ReactNode;
}

export function ChangeUserRoleDialog({
  userId,
  userName,
  currentRoleName,
  currentVendorId,
  trigger,
}: ChangeUserRoleDialogProps) {
  const {
    open,
    selectedRoleId,
    selectedVendorId,
    errorMsg,
    rolesQuery,
    vendorsQuery,
    isVendorRole,
    mutation,
    handleOpenChange,
    handleSave,
    handleOpenTrigger,
    handleRoleSelectChange,
    handleVendorSelectChange,
    handleCancel,
  } = useChangeUserRoleDialogPresentation({ userId, currentVendorId });

  return (
    <>
      {trigger ?? (
        <Button size="sm" variant="outline" onClick={handleOpenTrigger}>
          Change Role
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={changeUserRoleDialogStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle className={changeUserRoleDialogStyles.title}>
              <ShieldCheck className={changeUserRoleDialogStyles.titleIcon} />
              Change User Role
            </DialogTitle>
            <DialogDescription>
              Update role and permission access for {userName}. Current role:{" "}
              <strong>{currentRoleName}</strong>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className={changeUserRoleDialogStyles.errorAlert}>
              <ShieldAlert className={changeUserRoleDialogStyles.errorIcon} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className={changeUserRoleDialogStyles.formBody}>
            <label
              htmlFor="change-user-role"
              className={changeUserRoleDialogStyles.label}
            >
              Select New Role
            </label>
            {rolesQuery.isLoading ? (
              <p className={changeUserRoleDialogStyles.loadingText}>
                Loading roles...
              </p>
            ) : (
              <select
                id="change-user-role"
                value={selectedRoleId}
                onChange={handleRoleSelectChange}
                className={changeUserRoleDialogStyles.selectInput}
              >
                <option value="">-- Select a role --</option>
                <RoleOptionsList
                  roles={rolesQuery.data}
                  currentRoleName={currentRoleName}
                />
              </select>
            )}

            {isVendorRole && (
              <div className={changeUserRoleDialogStyles.vendorSection}>
                <label
                  htmlFor="change-user-vendor"
                  className={changeUserRoleDialogStyles.label}
                >
                  Select Associated Vendor Store
                </label>
                {vendorsQuery.isLoading ? (
                  <p className={changeUserRoleDialogStyles.loadingText}>
                    Loading vendor stores...
                  </p>
                ) : (
                  <select
                    id="change-user-vendor"
                    value={selectedVendorId}
                    onChange={handleVendorSelectChange}
                    className={changeUserRoleDialogStyles.selectInput}
                  >
                    <option value="">-- Select a vendor store --</option>
                    <VendorOptionsList vendors={vendorsQuery.data?.items} />
                  </select>
                )}
              </div>
            )}
          </div>

          <DialogFooter className={changeUserRoleDialogStyles.footer}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
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
