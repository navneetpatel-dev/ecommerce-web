"use client";

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import {
  notificationsApi,
  type NotificationLogFilters,
} from "../../api/notifications/notifications.api";
import { NotificationLogFiltersBar } from "../../components/notifications/NotificationLogFiltersBar.component";
import { BroadcastNotificationForm } from "../../components/notifications/BroadcastNotificationForm.component";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminNotificationsPage() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationLogFilters>({});

  const loadLogs = useCallback(() => notificationsApi.logs(filters), [filters]);

  const sendTest = async () => {
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      await notificationsApi.sendTest();
      setMessage("Test notification queued for your account.");
    } catch (sendError) {
      setError(
        getApiErrorMessage(sendError, "Could not queue the test notification."),
      );
    } finally {
      setPending(false);
    }
  };

  const messageElement = message ? (
    <p className={adminPagesStyles.successSmText}>{message}</p>
  ) : null;
  const errorElement = error ? (
    <p className={adminPagesStyles.errorSmText}>{error}</p>
  ) : null;

  return (
    <div className={adminPagesStyles.stack5}>
      <div className={adminPagesStyles.headerRow}>
        <div>
          <h1 className={adminPagesStyles.pageHeadingLgNormal}>
            Notification delivery
          </h1>
          <p className={adminPagesStyles.hintMuted}>
            Recent transactional delivery attempts across email and browser
            push.
          </p>
        </div>
        <Button loading={pending} onClick={() => void sendTest()}>
          <Send className={adminPagesStyles.iconSm} aria-hidden="true" />
          Send test
        </Button>
      </div>
      {messageElement}
      {errorElement}

      <BroadcastNotificationForm />

      <div>
        <h2 className={adminPagesStyles.subheadingMedium}>
          {notificationsAdminLabels.notificationLogFilters}
        </h2>
        <NotificationLogFiltersBar filters={filters} onChange={setFilters} />
      </div>

      <AdminDataPage
        title="Notification logs"
        hideTitle
        permission={PERMISSIONS.SETTINGS_MANAGE}
        load={loadLogs}
        columnKeys={[
          "type",
          "channel",
          "recipient",
          "status",
          "sentAt",
          "createdAt",
        ]}
      />
    </div>
  );
}
