"use client";

import { useCallback, useState } from "react";
import {
  notificationsApi,
  type NotificationLogFilters,
} from "../../api/notifications/notifications.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export function useAdminNotificationsPage() {
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

  return {
    pending,
    message,
    error,
    filters,
    setFilters,
    loadLogs,
    sendTest,
  };
}
