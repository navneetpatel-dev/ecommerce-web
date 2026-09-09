import {
  PANEL_ELEVATED,
  PANEL_HEADER_COMPACT,
  FLEX_CENTER_GAP_2,
  MIN_W_ZERO_FLEX_1,
  TEXT_MUTED_SM,
} from "@/shared/styles/common.styles";

export const taskContactCardStyles = {
  card: PANEL_ELEVATED,
  header: `${FLEX_CENTER_GAP_2} ${PANEL_HEADER_COMPACT}`,
  headerIcon: "size-4 text-brand",
  eyebrow: "!mb-0",
  body: "space-y-4 p-5",
  customerRow: "flex items-start gap-3",
  avatarCircle:
    "flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper/60 text-ink-muted",
  avatarIcon: "size-4",
  customerContent: MIN_W_ZERO_FLEX_1,
  captionLabel:
    "text-caption font-semibold uppercase tracking-wider text-ink-muted",
  customerName: "mt-0.5 truncate font-medium text-ink",
  phoneLine: TEXT_MUTED_SM,
  addressSection: "border-t border-line/60 pt-3",
  addressText: "mt-1 text-body-sm leading-relaxed text-ink",
  instructionsNotice:
    "flex items-start gap-2 rounded-md border border-line bg-warning/10 p-3",
  instructionsIcon: "mt-0.5 size-4 shrink-0 text-warning",
  instructionsText: "text-body-sm leading-relaxed text-ink",
  actionsGrid: "grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2",
  buttonIcon: "size-3.5",
  fullWidthButton: "w-full",
  spanButton: "col-span-full w-full",
} as const;
