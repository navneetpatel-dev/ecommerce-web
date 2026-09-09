"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { LABELS } from "@/shared/constants/labels";
import { ChangePasswordSection } from "@/features/auth";
import { BrowserNotificationsSetting } from "../BrowserNotificationsSetting.component";
import { useSecuritySection } from "./useSecuritySection.hook";
import { SessionsList } from "./SessionsList.component";
import { SessionsLoadingSkeleton } from "./SessionsLoadingSkeleton.component";
import { SessionsEmptyState } from "./SessionsEmptyState.component";
import { RevokeOtherSessionsDialog } from "./RevokeOtherSessionsDialog.component";
import { RevokeSessionDialog } from "./RevokeSessionDialog.component";
import { securitySectionStyles as styles } from "./securitySection.styles";

export function SecuritySection() {
  const {
    profile,
    sessions,
    sessionViewModels,
    hasOthers,
    revokeOthersOpen,
    isRevokingOthers,
    revokeFamily,
    isRevokingSession,
    targetDeviceName,
    sessionError,
    handleOpenRevokeOthers,
    handleCloseRevokeOthers,
    handleConfirmRevokeOthers,
    handleOpenRevokeSession,
    handleCloseRevokeSession,
    handleConfirmRevokeSession,
  } = useSecuritySection();

  return (
    <div className={styles.container}>
      <ChangePasswordSection
        form={profile.form}
        onSubmit={profile.onSubmit}
        error={profile.error}
        isPending={profile.isPending}
        isSuccess={profile.isSuccess}
        onChangeAgain={profile.resetSuccess}
      />

      <BrowserNotificationsSetting />

      <section className={styles.sessionsSection}>
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>Active sessions</h2>
            <p className={styles.subtitle}>
              Devices signed in with your account.
            </p>
          </div>
          {hasOthers && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenRevokeOthers}
            >
              Sign out others
            </Button>
          )}
        </div>

        {sessions.isLoading ? (
          <SessionsLoadingSkeleton />
        ) : sessions.isError ? (
          <div className={styles.errorContainer}>
            <QueryErrorAlert
              error={sessions.error}
              fallback={LABELS.couldNotLoadSessions}
            />
          </div>
        ) : sessionViewModels.length === 0 ? (
          <SessionsEmptyState />
        ) : (
          <SessionsList
            sessions={sessionViewModels}
            onRevoke={handleOpenRevokeSession}
          />
        )}

        <div className={styles.errorWrapper}>
          <FormError
            error={sessionError}
            fallback="Could not update sessions."
          />
        </div>
      </section>

      <RevokeOtherSessionsDialog
        open={revokeOthersOpen}
        isPending={isRevokingOthers}
        onClose={handleCloseRevokeOthers}
        onConfirm={handleConfirmRevokeOthers}
      />

      <RevokeSessionDialog
        open={Boolean(revokeFamily)}
        targetDeviceName={targetDeviceName}
        isPending={isRevokingSession}
        onClose={handleCloseRevokeSession}
        onConfirm={handleConfirmRevokeSession}
      />
    </div>
  );
}
