import { cn } from "@/shared/utils/cn";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";

export const payoutsTableStyles = {
  title: "mb-4 text-[1.375rem] font-semibold text-ink",
  mobileList: "space-y-3 lg:hidden",
  mobileEmpty:
    "rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted",
  mobileCard:
    "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
  mobileCardHeader: "flex items-start justify-between gap-3",
  mobileCardPeriod: "text-[0.875rem] text-ink",
  mobileCardAmount: "mt-2 font-mono text-[1rem] text-ink",
  mobileCardDetails: "mt-2 text-body-sm text-ink-muted",
  desktopCell: TABLE_DATA_CELL_CLASS,
  desktopCellBody: cn(TABLE_DATA_CELL_CLASS, "text-body"),
  desktopCellMono: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
  desktopCellMuted: cn(TABLE_DATA_CELL_CLASS, "text-body-sm text-ink-muted"),
  desktopEmptyCell: "text-center text-ink-muted",
} as const;
