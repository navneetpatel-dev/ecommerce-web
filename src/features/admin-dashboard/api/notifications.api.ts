import { apiClient } from "@/shared/api/client";
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

type NotificationLogResponse = Omit<NotificationLogRow, "recipient"> & {
  user?: { email?: string | null } | null;
};

export const notificationsApi = {
  logs: async (): Promise<NotificationLogRow[]> => {
    const rows = await apiClient.get<NotificationLogResponse[]>(
      API.notifications.logs,
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
};
