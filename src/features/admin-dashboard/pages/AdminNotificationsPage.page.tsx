"use client";

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { AdminDataPage } from "./AdminDataPage.page";
import {
  notificationsApi,
  type NotificationLogFilters,
} from "../api/notifications.api";
import { NotificationLogFiltersBar } from "../components/NotificationLogFiltersBar.component";
import { BroadcastNotificationForm } from "../components/BroadcastNotificationForm.component";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.5rem] text-ink">
            Notification delivery
          </h1>
          <p className="mt-1 text-body-sm text-ink-muted">
            Recent transactional delivery attempts across email and browser
            push.
          </p>
        </div>
        <Button loading={pending} onClick={() => void sendTest()}>
          <Send className="size-4" aria-hidden="true" />
          Send test
        </Button>
      </div>
      {message ? <p className="text-body-sm text-success">{message}</p> : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}

      <BroadcastNotificationForm />

      <div>
        <h2 className="mb-2 text-body-sm font-medium text-ink">
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
