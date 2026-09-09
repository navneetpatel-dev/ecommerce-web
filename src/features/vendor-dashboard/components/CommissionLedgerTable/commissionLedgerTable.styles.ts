import { cn } from "@/shared/utils/cn";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";

export const commissionLedgerTableStyles = {
  title: "mb-4 text-[1.375rem] font-semibold text-ink",
  mobileList: "space-y-3 lg:hidden",
  mobileEmpty:
    "rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted",
  mobileCard:
    "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
  mobileCardHeader: "flex items-start justify-between gap-3",
  mobileCardDate: "text-[0.875rem] text-ink",
  mobileGrid: "mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.875rem]",
  mobileCommissionCol: "col-span-2",
  mobileLabel:
    "text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted",
  mobileValMono: "font-mono text-ink",
  mobileValText: "text-ink",
  mobileTdsRate: "text-ink-muted",
  desktopCell: TABLE_DATA_CELL_CLASS,
  desktopCellBody: cn(TABLE_DATA_CELL_CLASS, "text-body"),
  desktopCellMono: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
  desktopEmptyCell: "text-center text-ink-muted",
} as const;
