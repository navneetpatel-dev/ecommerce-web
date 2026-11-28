import { cn } from "@/shared/utils/dom/cn";

export const SUB_ORDER_CARD_STYLES = {
  headerMargin: "mb-1",
  buyAgainWrapper: "mt-4",
  refundNote: "mt-3 text-body-sm text-ink-muted",
  refundNoteFailed: "mt-3 text-body-sm text-warning-foreground",
  timelineContainer: "mt-5 border-t border-line pt-5",
  timelineEyebrow: "mb-3",
  returnDialogBody: "space-y-4",
  returnSuccessText: "text-[0.875rem] text-success",
  returnEstimate:
    "space-y-1 rounded-md border border-line bg-surface px-3 py-2",
  returnEstimateAmount: "text-[0.875rem] font-medium text-ink",
  returnEstimateMuted: "text-[0.8125rem] text-ink-muted",
  returnEstimateWarning: (strong: boolean) =>
    cn(
      "flex items-start gap-1.5 text-[0.8125rem]",
      strong ? "font-medium text-danger" : "text-warning",
    ),
  returnEstimateIcon: "mt-0.5 size-3.5 shrink-0",
  shipmentBadgeRow: "inline-flex items-center gap-1.5",
  shipmentLabel: "text-[0.6875rem] font-medium text-ink-faint",
} as const;
