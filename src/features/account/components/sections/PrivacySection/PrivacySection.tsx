"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useLogout } from "@/features/auth";
import { useThemePalette } from "@/shared/hooks/useThemePalette.hook";
import { PATHS } from "@/shared/constants/paths";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import { isCustomerRole, isWorkspaceRole } from "@/shared/utils/roles";
import {
  useDeleteAccount,
  useExportAccount,
} from "../../../api/account.queries";
import { DangerZoneSection } from "./DangerZoneSection";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { LogoutDialog } from "./LogoutDialog";
import { PreferencesSection } from "./PreferencesSection";

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
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
    queryClient.clear();
    setDeleteOpen(false);
    router.replace(PATHS.home);
  };

  const handleExport = async () => {
    const data = await exportAccount.mutateAsync();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `account-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
