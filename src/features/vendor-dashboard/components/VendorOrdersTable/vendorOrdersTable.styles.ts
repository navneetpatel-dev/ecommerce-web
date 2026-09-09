import {
  TABLE_DATA_CELL_CLASS,
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table";
import { cn } from "@/shared/utils/cn";

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
} as const;
