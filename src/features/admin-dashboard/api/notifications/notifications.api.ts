import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export type NotificationLogRow = {
  id: string;
  type: string;
  channel: string;
  recipient: string;
  status: string;
  /** Why a failed email failed (TEMPORARY, PERMANENT, RENDER, RECIPIENT, CONFIG, UNCERTAIN). */
  errorCategory: string | null;
  error: string | null;
  attempts?: number;
  sentAt: string | null;
  createdAt: string;
};

export type NotificationLogFilters = {
  search?: string;
  type?: string;
  channel?: string;
  status?: string;
  errorCategory?: string;
  referenceId?: string;
};

export type BroadcastChannel = "EMAIL" | "PUSH" | "IN_APP";
export type BroadcastClassification = "operational" | "marketing";
export type BroadcastPriority = "standard" | "high";
export type BroadcastMode =
  "roles" | "users" | "user_segment" | "vendor_segment";

export type BroadcastTargetConfig = {
  mode?: BroadcastMode;
  allUsers?: boolean;
  role?: string;
  roles?: string[];
  userIds?: string[];
  emails?: string[];
  userSegment?: {
    status?: "ACTIVE" | "BLOCKED" | "ALL";
    emailVerified?: boolean;
    emailMarketingConsent?: boolean;
    signedUpWithinDays?: number;
    activity?:
      | "ordered_last_30d"
      | "inactive_30d"
      | "inactive_90d"
      | "repeat_buyers"
      | "abandoned_cart";
    state?: string;
    city?: string;
  };
  vendorSegment?: {
    vendorStatus?: "APPROVED" | "PENDING" | "SUSPENDED";
    kycVerified?: boolean;
    categoryIds?: string[];
    state?: string;
    minPerformanceScore?: number;
    maxPerformanceScore?: number;
  };
  excludeUserIds?: string[];
  excludeRoles?: string[];
};

export type BroadcastNotificationPayload = BroadcastTargetConfig & {
  subject: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  classification?: BroadcastClassification;
  priority?: BroadcastPriority;
  channels?: BroadcastChannel[];
  scheduledAt?: string | null;
};

export type BroadcastResult = {
  broadcastId: string;
  status?: string;
  scheduledAt?: string | null;
  targeted: number;
  queued: number;
};

export type BroadcastTargetUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  businessName?: string | null;
};

export type BroadcastTargetsPreview = {
  total: number;
  emailEligible: number;
  pushEligible: number;
  inAppEligible: number;
  sampleRecipients: BroadcastTargetUser[];
  sampleHasMore?: boolean;
};

export type PaginatedLookupResult<T> = {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
};

export type BroadcastCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminBroadcastRecord = {
  id: string;
  subject: string;
  message: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  classification: BroadcastClassification;
  priority: BroadcastPriority;
  channels: BroadcastChannel[];
  targetConfig: BroadcastTargetConfig;
  status: "SCHEDULED" | "PROCESSING" | "SENT" | "CANCELLED" | "FAILED";
  scheduledAt: string | null;
  sentAt: string | null;
  targetedCount: number;
  queuedCount: number;
  error?: string | null;
  stats?: {
    sentCount: number;
    failedCount: number;
    bouncedCount: number;
    pendingCount: number;
  };
  createdAt: string;
  actor?: { id: string; name: string; email: string } | null;
};

export type EmailSuppressionRow = {
  id: string;
  email: string;
  reason: string;
  expiresAt: string;
  updatedAt: string;
};

export type BulkResendResult = {
  attempted: number;
  requeued: number;
  skipped: number;
  errors: string[];
};

export type BulkResendPreview = {
  totalEligible: number;
  failedCount: number;
  stuckPendingCount: number;
  skippedNoPayloadCount: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  sampleRows: Array<{
    id: string;
    type: string;
    recipient: string;
    status: string;
    errorCategory: string | null;
    error: string | null;
    attempts: number;
    createdAt: string;
  }>;
};

type NotificationLogResponse = Omit<NotificationLogRow, "recipient"> & {
  user?: { email?: string | null } | null;
  /** Set for recipients without an account (subscribers, contact enquiries, gift-card recipients). */
  recipientEmail?: string | null;
};

export type EmailAudience = "customer" | "vendor" | "admin";

export type EmailTemplateSummary = {
  type: string;
  audience: EmailAudience;
  group: string;
  subject: string;
  marketing: boolean;
};

export type EmailHealth = {
  status: "OK" | "DEGRADED" | "DOWN";
  headline: string;
  windowMinutes: number;
  sent: number;
  failed: number;
  stuck: number;
  failuresByCategory: Record<string, number>;
  lastSentAt: string | null;
  lastFailure: {
    category: string | null;
    error: string | null;
    at: string;
  } | null;
};

export type EmailTemplatePreview = {
  subject: string;
  html: string;
  text: string;
};

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
