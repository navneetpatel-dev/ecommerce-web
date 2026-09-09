import { cn } from "@/shared/utils/cn";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import {
  TABLE_TITLE,
  TABLE_CARD_MOBILE_LIST,
  TABLE_CARD_MOBILE_EMPTY,
  TABLE_CARD_MOBILE,
  TABLE_CARD_MOBILE_HEADER,
  TABLE_CARD_MOBILE_LABEL,
  TABLE_CELL_EMPTY,
} from "@/shared/styles/table.styles";

export const commissionLedgerTableStyles = {
  title: TABLE_TITLE,
  mobileList: TABLE_CARD_MOBILE_LIST,
  mobileEmpty: TABLE_CARD_MOBILE_EMPTY,
  mobileCard: TABLE_CARD_MOBILE,
  mobileCardHeader: TABLE_CARD_MOBILE_HEADER,
  mobileCardDate: "text-[0.875rem] text-ink",
  mobileGrid: "mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.875rem]",
  mobileCommissionCol: "col-span-2",
  mobileLabel: TABLE_CARD_MOBILE_LABEL,
  mobileValMono: "font-mono text-ink",
  mobileValText: "text-ink",
  mobileTdsRate: "text-ink-muted",
  desktopCell: TABLE_DATA_CELL_CLASS,
  desktopCellBody: cn(TABLE_DATA_CELL_CLASS, "text-body"),
  desktopCellMono: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
  desktopEmptyCell: TABLE_CELL_EMPTY,
} as const;
