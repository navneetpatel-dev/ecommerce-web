import { cn } from "@/shared/utils/dom/cn";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table/table";
import {
  TABLE_TITLE,
  TABLE_CARD_MOBILE_LIST,
  TABLE_CARD_MOBILE_EMPTY,
  TABLE_CARD_MOBILE,
  TABLE_CARD_MOBILE_HEADER,
  TABLE_CELL_EMPTY,
} from "@/shared/styles/table.styles";

export const payoutsTableStyles = {
  title: TABLE_TITLE,
  mobileList: TABLE_CARD_MOBILE_LIST,
  mobileEmpty: TABLE_CARD_MOBILE_EMPTY,
  mobileCard: TABLE_CARD_MOBILE,
  mobileCardHeader: TABLE_CARD_MOBILE_HEADER,
  mobileCardPeriod: "text-[0.875rem] text-ink",
  mobileCardAmount: "mt-2 font-mono text-[1rem] text-ink",
  mobileCardDetails: "mt-2 text-body-sm text-ink-muted",
  desktopCell: TABLE_DATA_CELL_CLASS,
  desktopCellBody: cn(TABLE_DATA_CELL_CLASS, "text-body"),
  desktopCellMono: cn(TABLE_DATA_CELL_CLASS, "font-mono"),
  desktopCellMuted: cn(TABLE_DATA_CELL_CLASS, "text-body-sm text-ink-muted"),
  desktopEmptyCell: TABLE_CELL_EMPTY,
} as const;
