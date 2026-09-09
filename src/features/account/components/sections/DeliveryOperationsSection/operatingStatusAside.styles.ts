import {
  PANEL_ELEVATED,
  PANEL_HEADER,
  ROW_BETWEEN,
  TEXT_MUTED_SM,
  TEXT_INK_MEDIUM,
} from "@/shared/styles/common.styles";

export const operatingStatusAsideStyles = {
  root: "space-y-6",
  card: PANEL_ELEVATED,
  header: PANEL_HEADER,
  subtitle: "mt-1 text-[0.875rem] text-ink-muted",
  body: "space-y-4 p-5 md:p-6",
  partnerRow: "flex items-start gap-3",
  vehicleBadge:
    "flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-brand",
  partnerContent: "min-w-0",
  partnerEyebrow:
    "text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint",
  partnerName: "mt-0.5 font-medium text-ink",
  partnerPhone: TEXT_MUTED_SM,
  ratingRow: "mt-1 flex items-center gap-1 text-body-sm",
  ratingStar: "size-3.5 fill-warning text-warning",
  ratingNumber: TEXT_INK_MEDIUM,
  ratingCount: "text-ink-muted",
  statusBlock: "border-t border-line/60 pt-4 space-y-2",
  statusRow: `${ROW_BETWEEN} text-body-sm`,
  statusLabel: "text-ink-muted",
  statusVal: TEXT_INK_MEDIUM,
  stationVal: "font-mono text-ink text-body-sm",
  actionsSection: "border-t border-line/60 pt-4",
  fieldQueueButton: "w-full gap-2 justify-between",
} as const;
