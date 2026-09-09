"use client";

import { DangerZoneSection } from "./DangerZoneSection.component";
import { DeleteAccountDialog } from "./DeleteAccountDialog.component";
import { LogoutDialog } from "./LogoutDialog.component";
import { PreferencesSection } from "./PreferencesSection.component";
import { usePrivacySection } from "../../../hooks/privacy/usePrivacySection.hook";
import { privacySectionStyles as styles } from "../../../styles/privacy/privacySection.styles";

export function PrivacySection() {
  const {
    theme,
    mounted,
    isWorkspace,
    isCustomer,
    exportPending,
    exportError,
    logoutOpen,
    isLoggingOut,
    deleteOpen,
    confirmText,
    canConfirm,
    isDeleting,
    deleteError,
    handleSetThemeLight,
    handleSetThemeDark,
    handleExport,
    handleOpenLogout,
    handleCloseLogout,
    handleConfirmLogout,
    handleOpenDelete,
    handleDeleteOpenChange,
    handleDelete,
    handleConfirmTextChange,
  } = usePrivacySection();

  return (
    <div className={styles.container}>
      <PreferencesSection
        theme={theme}
        mounted={mounted}
        isWorkspace={isWorkspace}
        isCustomer={isCustomer}
        exportPending={exportPending}
        exportError={exportError}
        onSetThemeLight={handleSetThemeLight}
        onSetThemeDark={handleSetThemeDark}
        onExport={handleExport}
        onSignOutClick={handleOpenLogout}
      />

      <DangerZoneSection
        isWorkspace={isWorkspace}
        onDeleteClick={handleOpenDelete}
      />

      <LogoutDialog
        open={logoutOpen}
        onOpenChange={handleCloseLogout}
        pending={isLoggingOut}
        onConfirm={handleConfirmLogout}
      />

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={handleDeleteOpenChange}
        confirmText={confirmText}
        canConfirm={canConfirm}
        pending={isDeleting}
        error={deleteError}
        onConfirmTextChange={handleConfirmTextChange}
        onConfirm={handleDelete}
      />
    </div>
  );
}
