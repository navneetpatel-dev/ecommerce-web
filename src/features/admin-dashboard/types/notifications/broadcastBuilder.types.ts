import type {
  BroadcastCategoryOption,
  BroadcastChannel,
  BroadcastClassification,
  BroadcastMode,
  BroadcastPriority,
  BroadcastTargetConfig,
  BroadcastTargetUser,
} from "../../api/notifications/notifications.api";

export interface BroadcastBuilderState {
  step: 1 | 2;
  mode: BroadcastMode;
  allUsers: boolean;
  roles: string[];
  selectedUsers: BroadcastTargetUser[];
  emailsText: string;
  userSegment: NonNullable<BroadcastTargetConfig["userSegment"]>;
  vendorSegment: NonNullable<BroadcastTargetConfig["vendorSegment"]>;
  selectedCategories: BroadcastCategoryOption[];
  excludeUsers: BroadcastTargetUser[];
  excludeRoles: string[];
  channels: BroadcastChannel[];
  classification: BroadcastClassification;
  priority: BroadcastPriority;
  subject: string;
  message: string;
  ctaEnabled: boolean;
  ctaLabel: string;
  ctaUrl: string;
  scheduleEnabled: boolean;
  scheduledAt: string;
}

export const INITIAL_BROADCAST_STATE: BroadcastBuilderState = {
  step: 1,
  mode: "roles",
  allUsers: false,
  roles: ["CUSTOMER"],
  selectedUsers: [],
  emailsText: "",
  userSegment: { status: "ACTIVE" },
  vendorSegment: { vendorStatus: "APPROVED" },
  selectedCategories: [],
  excludeUsers: [],
  excludeRoles: [],
  channels: ["EMAIL", "IN_APP"],
  classification: "operational",
  priority: "standard",
  subject: "",
  message: "",
  ctaEnabled: false,
  ctaLabel: "",
  ctaUrl: "",
  scheduleEnabled: false,
  scheduledAt: "",
};
