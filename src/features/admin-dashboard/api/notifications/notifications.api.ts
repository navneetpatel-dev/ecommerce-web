import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type {
  AdminBroadcastRecord,
  BroadcastCategoryOption,
  BroadcastChannel,
  BroadcastClassification,
  BroadcastNotificationPayload,
  BroadcastResult,
  BroadcastTargetConfig,
  BroadcastTargetUser,
  BroadcastTargetsPreview,
  PaginatedLookupResult,
} from "./broadcast.types";
import type {
  BulkResendPreview,
  BulkResendResult,
  EmailHealth,
  EmailSuppressionRow,
  EmailTemplatePreview,
  EmailTemplateSummary,
  NotificationLogFilters,
  NotificationLogResponse,
  NotificationLogRow,
} from "./notifications.types";

export type * from "./broadcast.types";
export type {
  NotificationLogRow,
  NotificationLogFilters,
  EmailSuppressionRow,
  BulkResendResult,
  BulkResendPreview,
  EmailAudience,
  EmailTemplateSummary,
  EmailHealth,
  EmailTemplatePreview,
} from "./notifications.types";

export const notificationsApi = {
  logs: async (
    filters: NotificationLogFilters = {},
  ): Promise<NotificationLogRow[]> => {
    const query = new URLSearchParams();
    if (filters.search) query.set("search", filters.search);
    if (filters.type) query.set("type", filters.type);
    if (filters.channel) query.set("channel", filters.channel);
    if (filters.status) query.set("status", filters.status);
    if (filters.errorCategory)
      query.set("errorCategory", filters.errorCategory);
    if (filters.referenceId) query.set("referenceId", filters.referenceId);
    const qs = query.toString();
    const rows = await apiClient.get<NotificationLogResponse[]>(
      qs ? `${API.notifications.logs}?${qs}` : API.notifications.logs,
    );
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      channel: row.channel,
      recipient: row.user?.email ?? row.recipientEmail ?? "Unknown recipient",
      status: row.status,
      errorCategory: row.errorCategory ?? null,
      error: row.error ?? null,
      attempts: row.attempts ?? 0,
      sentAt: row.sentAt,
      createdAt: row.createdAt,
    }));
  },
  health: () => apiClient.get<EmailHealth>(API.notifications.health),
  resend: (id: string) =>
    apiClient.post<{ id: string; status: string }>(
      API.notifications.resend(id),
      {},
    ),
  previewBulkResend: (payload: {
    ids?: string[];
    referenceId?: string;
    type?: string;
    errorCategory?: string;
    includeStuckPending?: boolean;
  }) =>
    apiClient.post<BulkResendPreview>(
      API.notifications.bulkResendPreview,
      payload,
    ),
  bulkResend: (payload: {
    ids?: string[];
    referenceId?: string;
    type?: string;
    errorCategory?: string;
    includeStuckPending?: boolean;
  }) => apiClient.post<BulkResendResult>(API.notifications.bulkResend, payload),
  retryBroadcastFailed: (id: string) =>
    apiClient.post<BulkResendResult>(
      API.notifications.broadcastRetryFailed(id),
      {},
    ),
  sendBroadcastRecordTest: (id: string) =>
    apiClient.post<{ sentTo: string; queued: number }>(
      API.notifications.broadcastSendTest(id),
      {},
    ),
  listSuppressions: (search = "", page = 1, limit = 25) =>
    apiClient.get<PaginatedLookupResult<EmailSuppressionRow>>(
      API.notifications.suppressions(search, page, limit),
    ),
  clearSuppression: (email: string) =>
    apiClient.post<{ cleared: boolean }>(API.notifications.suppressionsClear, {
      email,
    }),
  templates: () =>
    apiClient.get<EmailTemplateSummary[]>(API.notifications.templates),
  previewTemplate: (type: string, theme: "light" | "dark") =>
    apiClient.get<EmailTemplatePreview>(
      API.notifications.templatePreview(type, theme),
    ),
  sendTemplateTest: (type: string) =>
    apiClient.post<{ sentTo: string }>(
      API.notifications.templateTest(type),
      {},
    ),
  sendTest: () =>
    apiClient.post<{ message: string }>(API.notifications.test, {}),
  broadcast: (payload: BroadcastNotificationPayload) =>
    apiClient.post<BroadcastResult>(API.notifications.broadcast, payload),
  previewBroadcastTargets: (payload: {
    targetConfig: BroadcastTargetConfig;
    classification?: BroadcastClassification;
    channels?: BroadcastChannel[];
    page?: number;
    limit?: number;
  }) =>
    apiClient.post<BroadcastTargetsPreview>(
      API.notifications.broadcastPreview,
      payload,
    ),
  renderBroadcastPreview: (payload: {
    subject: string;
    message: string;
    ctaLabel?: string;
    ctaUrl?: string;
    classification?: BroadcastClassification;
    theme?: "light" | "dark";
  }) =>
    apiClient.post<EmailTemplatePreview>(
      API.notifications.broadcastRenderPreview,
      payload,
    ),
  sendBroadcastTest: (payload: BroadcastNotificationPayload) =>
    apiClient.post<{ sentTo: string; queued: number }>(
      API.notifications.broadcastTest,
      payload,
    ),
  listBroadcasts: () =>
    apiClient.get<AdminBroadcastRecord[]>(API.notifications.broadcasts),
  cancelBroadcast: (id: string) =>
    apiClient.post<AdminBroadcastRecord>(
      API.notifications.broadcastCancel(id),
      {},
    ),
  searchBroadcastUsers: (q: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedLookupResult<BroadcastTargetUser>>(
      API.notifications.broadcastUsers(q, page, limit),
    ),
  searchBroadcastCategories: (q: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedLookupResult<BroadcastCategoryOption>>(
      API.notifications.broadcastCategories(q, page, limit),
    ),
  searchBroadcastLocations: (
    field: "state" | "city",
    q: string,
    page = 1,
    limit = 20,
  ) =>
    apiClient.get<PaginatedLookupResult<string>>(
      API.notifications.broadcastLocations(field, q, page, limit),
    ),
};
