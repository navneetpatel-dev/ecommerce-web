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

export type NotificationLogResponse = Omit<NotificationLogRow, "recipient"> & {
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
