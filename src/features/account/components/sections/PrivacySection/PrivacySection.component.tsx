"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useLogout } from "@/features/auth";
import { useThemePalette } from "@/shared/hooks/useThemePalette.hook";
import { PATHS } from "@/shared/constants/paths";
import { saveJsonExport } from "@/shared/utils/fileDownload";
import { ACCOUNT_EXPORT_FILENAME_PREFIX } from "../../../constants";
import { isCustomerRole, isWorkspaceRole } from "@/shared/utils/roles";
import {
  useDeleteAccount,
  useExportAccount,
} from "../../../api/account.queries";
import { DangerZoneSection } from "./DangerZoneSection.component";
import { DeleteAccountDialog } from "./DeleteAccountDialog.component";
import { LogoutDialog } from "./LogoutDialog.component";
import { PreferencesSection } from "./PreferencesSection.component";

export function PrivacySection() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const deleteAccount = useDeleteAccount();
  const exportAccount = useExportAccount();
  const logout = useLogout();
  const clearSession = useAuthStore((s) => s.clearSession);
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mode: theme, setMode: setTheme, mounted } = useThemePalette();

  const isCustomer = isCustomerRole(currentUser?.role);
  const isWorkspace = isWorkspaceRole(currentUser?.role);
  const canConfirm = confirmText.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    await deleteAccount.mutateAsync();
    clearSession();
    queryClient.clear();
    setDeleteOpen(false);
    router.replace(PATHS.home);
  };

  const handleExport = async () => {
    const data = await exportAccount.mutateAsync();
    saveJsonExport(data, ACCOUNT_EXPORT_FILENAME_PREFIX);
  };

  return (
    <div className="space-y-6">
      <PreferencesSection
        theme={theme}
        mounted={mounted}
        isWorkspace={isWorkspace}
        isCustomer={isCustomer}
        exportPending={exportAccount.isPending}
        exportError={exportAccount.error as Error | null}
        onSetTheme={setTheme}
        onExport={() => void handleExport()}
        onSignOutClick={() => setLogoutOpen(true)}
      />

      <DangerZoneSection
        isWorkspace={isWorkspace}
        onDeleteClick={() => {
          setConfirmText("");
          setDeleteOpen(true);
        }}
      />

      <LogoutDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        pending={logout.isPending}
        onConfirm={() => logout.mutate()}
      />

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setConfirmText("");
        }}
        confirmText={confirmText}
        canConfirm={canConfirm}
        pending={deleteAccount.isPending}
        error={deleteAccount.error as Error | null}
        onConfirmTextChange={setConfirmText}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
