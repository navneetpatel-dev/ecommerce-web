import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import { cn } from "@/shared/utils/cn";

export const commissionInvoicesTableStyles = {
  container: "w-full",
  heading: "mb-4 text-[1.375rem] font-semibold text-ink",
  mobileList: "space-y-3 lg:hidden",
  emptyMobileCard:
    "rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted",
  emptyTableRowCell: "text-center text-ink-muted",
  mobileCard:
    "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
  mobileCardNumber: "font-mono text-[0.875rem] text-ink",
  mobileCardDate: "mt-1 text-[0.875rem] text-ink-muted",
  mobileCardAmount: "mt-2 font-mono text-[1rem] text-ink",
  mobileCardButton: "mt-3",
  tableCellStandard: TABLE_DATA_CELL_CLASS,
  tableCellMono: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
} as const;
