import { TEXT_MUTED_SM, TEXT_DANGER_SM } from "@/shared/styles/common.styles";

export const subOrderShipmentTrackingStyles = {
  root: "mt-4 border-t border-dashed border-line pt-4",
  eyebrow: "mb-2",
  carrier: "text-body text-ink",
  trackingNumber: "mt-0.5 font-mono text-body-sm text-ink-muted",
  statusWrapper: "mt-2",
  agentRow: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1",
  agentLabel: TEXT_MUTED_SM,
  callAgentLink:
    "inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:underline",
  phoneIcon: "size-3.5",
  bannerNotice:
    "mt-2 rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-ink",
  warningNotice:
    "rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning",
  warningNoticeWithMargin:
    "mt-2 rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning",
  codAmount: "mt-2 text-body-sm text-ink-muted",
  attemptsList: "mt-2 space-y-1.5",
  viewPhotoLink: "ml-2 font-medium text-brand hover:underline",
  failedContainer: "mt-2 space-y-2",
  errorMessage: TEXT_DANGER_SM,
  proofOfDeliveryLink:
    "mt-2 inline-block text-body-sm font-medium text-brand hover:underline",
} as const;
