import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export type NotificationLogRow = {
  id: string;
  type: string;
  channel: string;
  recipient: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
};

export type NotificationLogFilters = {
  type?: string;
  channel?: string;
  status?: string;
};

export type BroadcastTarget =
  | { role: string; userIds?: undefined }
  | { userIds: string[]; role?: undefined };

export type BroadcastNotificationPayload = BroadcastTarget & {
  subject: string;
  message: string;
};

export type BroadcastResult = {
  broadcastId: string;
  targeted: number;
  queued: number;
};

type NotificationLogResponse = Omit<NotificationLogRow, "recipient"> & {
  user?: { email?: string | null } | null;
};

export const notificationsApi = {
  logs: async (
    filters: NotificationLogFilters = {},
  ): Promise<NotificationLogRow[]> => {
    const query = new URLSearchParams();
    if (filters.type) query.set("type", filters.type);
    if (filters.channel) query.set("channel", filters.channel);
    if (filters.status) query.set("status", filters.status);
    const qs = query.toString();
    const rows = await apiClient.get<NotificationLogResponse[]>(
      qs ? `${API.notifications.logs}?${qs}` : API.notifications.logs,
    );
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      channel: row.channel,
      recipient: row.user?.email ?? "Unknown recipient",
      status: row.status,
      sentAt: row.sentAt,
      createdAt: row.createdAt,
    }));
  },
  sendTest: () =>
    apiClient.post<{ message: string }>(API.notifications.test, {}),
  broadcast: (payload: BroadcastNotificationPayload) =>
    apiClient.post<BroadcastResult>(API.notifications.broadcast, payload),
};
