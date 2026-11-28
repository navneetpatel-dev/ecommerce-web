"use client";

import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { WalletTransaction } from "@/shared/api/types";
import { transactionSourceLabel } from "../../utils/transactions/transactionSource";
import { walletTransactionsTableStyles as styles } from "../../styles/transactions/walletTransactionsTable.styles";

function WalletAmountValue({
  row,
  className,
}: {
  row: WalletTransaction;
  className?: string;
}) {
  const isCredit = row.type === "CREDIT";
  const signedAmount = `${isCredit ? "+" : "−"}${formatPoints(row.amount)}`;
  return (
    <span
      className={cn(
        isCredit ? styles.creditAmountPositive : styles.creditAmountNegative,
        className,
      )}
    >
      {signedAmount}
    </span>
  );
}

export const walletTransactionColumns: DataTableColumn<WalletTransaction>[] = [
  {
    id: "date",
    header: LABELS.walletColumnDate,
    headerClassName: styles.colDateHeader,
    className: styles.colDateCell,
    truncate: false,
    cell: (row) => (
      <div className={styles.dateCell}>
        <span className={styles.dateText}>
          {formatOrderDate(row.createdAt)}
        </span>
        <WalletAmountValue row={row} className={styles.mobileAmount} />
      </div>
    ),
  },
  {
    id: "description",
    header: LABELS.walletColumnDescription,
    headerClassName: styles.colDescriptionHeader,
    className: styles.colDescriptionCell,
    mobileRowClassName: styles.mobileDescriptionRow,
    truncate: false,
    cell: (row) => {
      const sourceLabel = transactionSourceLabel(row);
      const rawDetail =
        row.description && row.description !== sourceLabel
          ? row.description
          : null;
      const detail = rawDetail
        ? rawDetail
            .replace(
              /#?[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})?\b/gi,
              "",
            )
            .replace(/\s{2,}/g, " ")
            .trim() || null
        : null;
      return (
        <div className={styles.descriptionWrapper}>
          <p className={styles.sourceLabel}>{sourceLabel}</p>
          {detail ? <p className={styles.detailLabel}>{detail}</p> : null}
        </div>
      );
    },
  },
  {
    id: "amount",
    header: LABELS.walletColumnAmount,
    headerClassName: styles.colAmountHeader,
    className: styles.colAmountCell,
    hideOnMobile: true,
    cell: (row) => <WalletAmountValue row={row} />,
  },
  {
    id: "balance",
    header: LABELS.walletColumnBalance,
    headerClassName: styles.colBalanceHeader,
    className: styles.colBalanceCell,
    hideOnMobile: true,
    cell: (row) => formatPoints(row.balanceAfter),
  },
];
