import type { DataTableColumn } from "@/shared/components/DataTable";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { GiftCardView } from "@/features/giftCards";
import { adminGiftCardsStyles as styles } from "../../styles/gift-cards/adminGiftCards.styles";

type Person = GiftCardView["purchaser"];

function renderPerson(person: Person) {
  if (!person) return "—";
  return (
    <span className={styles.person}>
      <span>{person.name ?? person.email}</span>
      <span className={styles.personEmail}>{person.email}</span>
    </span>
  );
}

/** Columns for the admin gift card list: who bought it, who it went to, who redeemed it. */
export function buildAdminGiftCardColumns(): DataTableColumn<GiftCardView>[] {
  return [
    {
      id: "code",
      header: LABELS.giftCardCode,
      truncate: false,
      cell: (row) => <span className={styles.code}>{row.code}</span>,
    },
    {
      id: "amount",
      header: LABELS.giftCardAmount,
      cell: (row) => formatInr(row.amount),
    },
    {
      id: "status",
      header: LABELS.giftCardStatus,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "buyer",
      header: LABELS.giftCardBuyer,
      truncate: false,
      cell: (row) => renderPerson(row.purchaser),
    },
    {
      id: "recipient",
      header: LABELS.giftCardRecipient,
      cell: (row) => row.recipientEmail,
    },
    {
      id: "redeemer",
      header: LABELS.giftCardRedeemer,
      truncate: false,
      cell: (row) => renderPerson(row.redeemer),
    },
    {
      id: "sent",
      header: LABELS.giftCardSentOn,
      cell: (row) => formatDate(row.purchasedAt),
    },
    {
      id: "expires",
      header: LABELS.giftCardExpires,
      cell: (row) => formatDate(row.expiresAt),
    },
  ];
}
