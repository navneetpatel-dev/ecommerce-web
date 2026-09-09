import {
  TABLE_DATA_CELL_CLASS,
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table/table";
import { cn } from "@/shared/utils/dom/cn";

export const VENDOR_ORDERS_TABLE_STYLES = {
  root: "space-y-4",
  heading: "text-[1.375rem] font-semibold text-ink",
  emptyState:
    "rounded-md border border-line bg-surface p-4 px-4 py-14 text-center text-ink-muted",
  cellData: TABLE_DATA_CELL_CLASS,
  cellDataOrder: cn(TABLE_DATA_CELL_CLASS, "font-mono text-body-sm"),
  cellDataSubtotal: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
  cellActions: TABLE_ACTIONS_CELL_CLASS,
  headActions: TABLE_ACTIONS_HEAD_CLASS,
  tableLayout: TABLE_PINNED_LAYOUT_CLASS,
  shipmentStack: "space-y-1",
  returnsStack: "space-y-1",
  returnRow: "flex items-center gap-2",
  proofLink: "text-body-sm font-medium text-brand hover:underline",
  mutedText: "text-body-sm text-ink-muted",

  trackingRoot: "space-y-1",
  trackingInput: "w-full min-w-[10rem] text-body-sm",
  trackingText: "text-body-sm text-ink-muted",

  actionsRoot: "space-y-2",
  actionsError: "text-body-sm text-danger",
  actionsSelect: "w-full min-w-[8.5rem] rounded-sm px-2 text-body-sm",

  cardList: "space-y-3 lg:hidden",
  cardItem: "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
  cardHeader: "flex items-start justify-between gap-3",
  cardHeaderLeft: "min-w-0",
  cardOrderNum: "font-mono text-body-sm text-ink",
  cardBadgeWrap: "mt-2",
  cardSubtotal: "mt-3 font-mono text-body text-ink",
  cardShipmentWrap: "mt-2 flex flex-wrap items-center gap-2",
  cardReturnsWrap: "mt-2 space-y-1",
  cardActionsWrap: "mt-4 border-t border-line/80 pt-3",
} as const;
