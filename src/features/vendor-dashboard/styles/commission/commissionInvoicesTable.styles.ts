import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table/table";
import {
  TABLE_TITLE,
  TABLE_CARD_MOBILE_LIST,
  TABLE_CARD_MOBILE_EMPTY,
  TABLE_CARD_MOBILE,
  TABLE_CELL_EMPTY,
} from "@/shared/styles/table.styles";
import { cn } from "@/shared/utils/dom/cn";

export const commissionInvoicesTableStyles = {
  container: "w-full",
  heading: TABLE_TITLE,
  mobileList: TABLE_CARD_MOBILE_LIST,
  emptyMobileCard: TABLE_CARD_MOBILE_EMPTY,
  emptyTableRowCell: TABLE_CELL_EMPTY,
  mobileCard: TABLE_CARD_MOBILE,
  mobileCardNumber: "font-mono text-[0.875rem] text-ink",
  mobileCardDate: "mt-1 text-[0.875rem] text-ink-muted",
  mobileCardAmount: "mt-2 font-mono text-[1rem] text-ink",
  mobileCardButton: "mt-3",
  tableCellStandard: TABLE_DATA_CELL_CLASS,
  tableCellMono: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
} as const;
