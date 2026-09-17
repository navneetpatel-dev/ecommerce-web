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

export const vendorReturnsTableStyles = {
  title: TABLE_TITLE,
  hint: "mb-4 max-w-3xl text-body text-ink-muted",
  mobileList: TABLE_CARD_MOBILE_LIST,
  mobileEmpty: TABLE_CARD_MOBILE_EMPTY,
  mobileCard: TABLE_CARD_MOBILE,
  mobileCardHeader: TABLE_CARD_MOBILE_HEADER,
  mobileCardProduct: "text-[0.875rem] font-medium text-ink",
  mobileCardMeta: "mt-2 text-body-sm text-ink-muted",
  mobileCardPickup: "mt-2 text-body-sm text-ink",
  mobileCardPhotos: "mt-3",
  desktopCell: TABLE_DATA_CELL_CLASS,
  desktopCellBody: cn(TABLE_DATA_CELL_CLASS, "text-body"),
  desktopCellMuted: cn(TABLE_DATA_CELL_CLASS, "text-body-sm text-ink-muted"),
  desktopEmptyCell: TABLE_CELL_EMPTY,
  photoButton: "text-body-sm font-medium text-brand hover:underline",
} as const;
