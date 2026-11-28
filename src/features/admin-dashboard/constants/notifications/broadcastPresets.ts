import type {
  BroadcastClassification,
  BroadcastPriority,
} from "../../api/notifications/notifications.api";

export type BroadcastPreset = {
  id: string;
  label: string;
  classification: BroadcastClassification;
  priority?: BroadcastPriority;
  subject: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export const BROADCAST_PRESETS: BroadcastPreset[] = [
  {
    id: "maintenance",
    label: "Scheduled platform maintenance",
    classification: "operational",
    priority: "high",
    subject: "Scheduled platform maintenance tonight (02:00 – 02:30 IST)",
    message:
      "We will perform brief scheduled maintenance tonight from 02:00 AM to 02:30 AM IST. Orders and storefront browsing may pause briefly during this window.\n\nThank you for your patience.",
  },
  {
    id: "kyc_reminder",
    label: "Vendor KYC verification reminder",
    classification: "operational",
    priority: "high",
    subject: "Action required: Complete KYC for {{businessName}}",
    message:
      "Please complete your pending KYC verification for {{businessName}} to keep payouts and product listings active without interruption.",
    ctaLabel: "Complete KYC",
    ctaUrl: "http://localhost:5273/vendor/kyc",
  },
  {
    id: "vendor_payout",
    label: "Vendor payout cycle notice",
    classification: "operational",
    priority: "standard",
    subject: "Upcoming payout settlement schedule for {{businessName}}",
    message:
      "Your next settlement cycle for {{businessName}} is scheduled for processing this Friday. Please ensure your bank details and GST records are up to date in your vendor portal.",
    ctaLabel: "View payouts",
    ctaUrl: "http://localhost:5273/vendor/payouts",
  },
  {
    id: "low_stock_prep",
    label: "Low-stock & festival inventory prep",
    classification: "operational",
    priority: "standard",
    subject: "Inventory check: Restock top SKUs for {{businessName}}",
    message:
      "Demand across {{city}} is trending up ahead of the upcoming sale event. Review your low-stock SKUs now to avoid missed orders.",
    ctaLabel: "Manage inventory",
    ctaUrl: "http://localhost:5273/vendor/products",
  },
  {
    id: "policy_update",
    label: "Policy & return guidelines update",
    classification: "operational",
    priority: "standard",
    subject: "Important update to marketplace return & seller terms",
    message:
      "We have updated our marketplace return and SLA guidelines effective next Monday. Please review the updated terms in your dashboard.",
    ctaLabel: "Review terms",
  },
  {
    id: "festival_sale",
    label: "Weekend mega sale early access",
    classification: "marketing",
    priority: "standard",
    subject: "Early access for {{firstName}}: Weekend Mega Sale is live!",
    message:
      "Our Weekend Mega Sale is now live with curated deals across top categories. Shop early before bestsellers sell out.",
    ctaLabel: "Shop deals",
    ctaUrl: "http://localhost:5273/products",
  },
  {
    id: "cart_recovery",
    label: "Abandoned cart exclusive incentive",
    classification: "marketing",
    priority: "standard",
    subject: "{{firstName}}, your saved picks are still waiting",
    message:
      "Items in your bag are selling fast. Complete your checkout today for priority dispatch to {{city}}.",
    ctaLabel: "Return to cart",
    ctaUrl: "http://localhost:5273/cart",
  },
  {
    id: "feature_launch",
    label: "New category & feature launch",
    classification: "marketing",
    priority: "standard",
    subject: "New arrivals & faster delivery now live in {{city}}",
    message:
      "Explore our newly launched collections with faster doorstep delivery and streamlined returns.",
    ctaLabel: "Explore new arrivals",
    ctaUrl: "http://localhost:5273/products",
  },
  {
    id: "nps_survey",
    label: "Customer experience & NPS survey",
    classification: "operational",
    priority: "standard",
    subject: "{{firstName}}, share 30 seconds of feedback with us",
    message:
      "Your feedback helps us improve product quality, delivery speed, and seller support across the marketplace.",
    ctaLabel: "Share feedback",
  },
  {
    id: "security_hygiene",
    label: "Account security & password reminder",
    classification: "operational",
    priority: "high",
    subject: "Security tip for {{email}}: Review your active sessions",
    message:
      "As part of routine security hygiene for your {{role}} account, please review your active devices and keep your password unique.",
    ctaLabel: "Review security",
    ctaUrl: "http://localhost:5273/account",
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
