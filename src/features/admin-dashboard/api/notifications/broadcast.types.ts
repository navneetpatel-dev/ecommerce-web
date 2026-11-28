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
