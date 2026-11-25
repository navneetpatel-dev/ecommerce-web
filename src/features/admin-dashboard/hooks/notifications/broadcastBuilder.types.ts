import type {
  BroadcastCategoryOption,
  BroadcastChannel,
  BroadcastClassification,
  BroadcastMode,
  BroadcastPriority,
  BroadcastTargetConfig,
  BroadcastTargetUser,
} from "../../api/notifications/notifications.api";

export type BroadcastPreset = {
  id: string;
  label: string;
  classification: BroadcastClassification;
  subject: string;
  message: string;
  ctaLabel?: string;
};

export const BROADCAST_PRESETS: BroadcastPreset[] = [
  {
    id: "maintenance",
    label: "Scheduled maintenance",
    classification: "operational",
    subject: "Scheduled platform maintenance tonight",
    message:
      "Hi {{firstName}},\n\nWe will perform brief scheduled maintenance tonight from 02:00 AM to 02:30 AM IST. Orders and storefront browsing may pause briefly during this window.\n\nThank you for your patience.",
  },
  {
    id: "kyc_reminder",
    label: "Vendor KYC reminder",
    classification: "operational",
    subject: "Action required: Complete KYC for {{businessName}}",
    message:
      "Hi {{firstName}},\n\nPlease complete your pending KYC verification for {{businessName}} to keep payouts and product listings active without interruption.",
    ctaLabel: "Complete KYC",
  },
  {
    id: "festival_sale",
    label: "Festival sale announcement",
    classification: "marketing",
    subject: "Early access for {{firstName}}: Weekend Mega Sale is live!",
    message:
      "Hi {{firstName}},\n\nOur Weekend Mega Sale is now live with curated deals across top categories. Shop early before bestsellers sell out.",
    ctaLabel: "Shop deals",
  },
  {
    id: "policy_update",
    label: "Policy update",
    classification: "operational",
    subject: "Important update to marketplace guidelines",
    message:
      "Hi {{firstName}},\n\nWe have updated our marketplace seller and return guidelines effective next week. Please review the updated terms in your dashboard.",
    ctaLabel: "Review terms",
  },
];

export const PERSONALIZATION_TOKENS = [
  "{{firstName}}",
  "{{fullName}}",
  "{{email}}",
  "{{role}}",
  "{{businessName}}",
  "{{city}}",
] as const;

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
