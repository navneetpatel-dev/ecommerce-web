"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useLogout } from "@/features/auth";
import { useThemePalette } from "@/shared/hooks/theme/useThemePalette.hook";
import { PATHS } from "@/shared/constants/paths/paths";
import { saveJsonExport } from "@/shared/utils/files/fileDownload";
import { ACCOUNT_EXPORT_FILENAME_PREFIX } from "../../constants/layout/constants";
import { isCustomerRole, isWorkspaceRole } from "@/shared/utils/roles/roles";
import {
  useDeleteAccount,
  useExportAccount,
} from "../../api/addresses/account.queries";

export function usePrivacySection() {
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

  const handleOpenLogout = () => {
    setLogoutOpen(true);
  };

  const handleCloseLogout = () => {
    setLogoutOpen(false);
  };

  const handleConfirmLogout = () => {
    logout.mutate();
  };

  const handleOpenDelete = () => {
    setConfirmText("");
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setConfirmText("");
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) setConfirmText("");
  };

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

  const handleSetThemeLight = () => {
    setTheme("light");
  };

  const handleSetThemeDark = () => {
    setTheme("dark");
  };

  return {
    theme,
    mounted,
    isWorkspace,
    isCustomer,
    exportPending: exportAccount.isPending,
    exportError: exportAccount.error as Error | null,
    logoutOpen,
    isLoggingOut: logout.isPending,
    deleteOpen,
    confirmText,
    canConfirm,
    isDeleting: deleteAccount.isPending,
    deleteError: deleteAccount.error as Error | null,
    handleSetThemeLight,
    handleSetThemeDark,
    handleExport,
    handleOpenLogout,
    handleCloseLogout,
    handleConfirmLogout,
    handleOpenDelete,
    handleCloseDelete,
    handleDeleteOpenChange,
    handleDelete,
    handleConfirmTextChange: setConfirmText,
  };
}
