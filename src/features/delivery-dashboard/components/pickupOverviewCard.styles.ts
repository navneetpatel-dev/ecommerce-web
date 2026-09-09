import {
  PANEL_ELEVATED,
  PANEL_HEADER_COMPACT,
  FLEX_BETWEEN_GAP_2,
} from "@/shared/styles/common.styles";

export const pickupOverviewCardStyles = {
  card: PANEL_ELEVATED,
  header: PANEL_HEADER_COMPACT,
  headerIcon: "size-4 text-brand",
  eyebrow: "!mb-0",
  body: "p-5",
  dlList: "grid gap-3 text-body-sm",
  row: FLEX_BETWEEN_GAP_2,
  dt: "text-ink-muted",
  ddMono: "truncate font-mono font-medium text-ink",
  ddType: "font-medium text-brand",
  itemSection: "border-t border-line/60 pt-3",
  ddProductName: "mt-0.5 truncate font-medium text-ink",
  orderRefRow: `${FLEX_BETWEEN_GAP_2} border-t border-line/60 pt-3`,
  ddOrderRef: "font-mono text-[0.8125rem] text-ink",
} as const;
