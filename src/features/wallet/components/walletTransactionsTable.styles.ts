export const walletTransactionsTableStyles = {
  colDateHeader: "w-[16%]",
  colDateCell: "w-[16%] whitespace-nowrap",
  colDescriptionHeader: "w-[46%]",
  colDescriptionCell: "w-[46%]",
  descriptionWrapper: "min-w-0",
  sourceLabel: "font-medium text-ink",
  detailLabel: "mt-0.5 text-body-sm text-ink-muted",
  colAmountHeader: "w-[16%] text-right",
  colAmountCell: "w-[16%] whitespace-nowrap text-right",
  creditAmountPositive: "font-semibold tabular-nums text-success",
  creditAmountNegative: "font-semibold tabular-nums text-ink",
  colBalanceHeader: "w-[16%] text-right",
  colBalanceCell:
    "w-[16%] whitespace-nowrap text-right tabular-nums text-ink-muted",
  tableTitle: "text-body font-semibold text-ink",
} as const;
