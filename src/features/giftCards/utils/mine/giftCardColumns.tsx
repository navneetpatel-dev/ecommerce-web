import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { CopyTextButton } from "@/shared/components/actions/CopyTextButton.component";
import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { GiftCardView } from "../../api/gift-cards/giftCards.api";
import { myGiftCardsPageStyles as styles } from "../../pages/mine/myGiftCardsPage.styles";

const codeColumn: DataTableColumn<GiftCardView> = {
  id: "code",
  header: LABELS.giftCardCode,
  truncate: false,
  cell: (row) => (
    <span className={styles.codeCell}>
      <span className={styles.code}>{row.code}</span>
      <CopyTextButton value={row.code} label={LABELS.giftCardCode} />
    </span>
  ),
};

const amountColumn: DataTableColumn<GiftCardView> = {
  id: "amount",
  header: LABELS.giftCardAmount,
  cell: (row) => formatInr(row.amount),
};

const statusColumn: DataTableColumn<GiftCardView> = {
  id: "status",
  header: LABELS.giftCardStatus,
  truncate: false,
  cell: (row) => <StatusBadge status={row.status} />,
};

/** Cards the customer bought and sent. */
export function buildPurchasedGiftCardColumns(): DataTableColumn<GiftCardView>[] {
  return [
    codeColumn,
    amountColumn,
    {
      id: "recipient",
      header: LABELS.giftCardRecipient,
      cell: (row) => row.recipientName ?? row.recipientEmail,
    },
    statusColumn,
    {
      id: "sent",
      header: LABELS.giftCardSentOn,
      cell: (row) => formatDate(row.purchasedAt),
    },
    {
      id: "expires",
      header: LABELS.giftCardExpires,
      cell: (row) =>
        row.redeemedAt ? formatDate(row.redeemedAt) : formatDate(row.expiresAt),
    },
  ];
}

/** Cards the customer redeemed into their wallet. */
export function buildRedeemedGiftCardColumns(): DataTableColumn<GiftCardView>[] {
  return [
    codeColumn,
    amountColumn,
    {
      id: "from",
      header: LABELS.giftCardFrom,
      cell: (row) => row.purchaser?.name ?? LABELS.giftCardSomeone,
    },
    {
      id: "redeemed",
      header: LABELS.giftCardRedeemedOn,
      cell: (row) => (row.redeemedAt ? formatDate(row.redeemedAt) : "—"),
    },
  ];
}
