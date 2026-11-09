import Link from "next/link";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr, shortOrderId } from "@/shared/utils/formatting/orderFormat";
import type { CashbackEntry, CashbackEntryStatus } from "../api/cashback.api";
import { cashbackHistoryPageStyles as styles } from "../styles/cashbackHistoryPage.styles";

const STATUS_LABEL: Record<CashbackEntryStatus, string> = {
  PENDING: LABELS.cashbackStatusPending,
  CREDITED: LABELS.cashbackStatusCredited,
  CANCELLED: LABELS.cashbackStatusCancelled,
};

/** When the cashback lands, as the server worked it out. */
export function cashbackWhen(entry: CashbackEntry): string {
  if (entry.status === "CREDITED" && entry.creditedAt) {
    return formatLabel(LABELS.cashbackCreditedOn, {
      date: formatDate(entry.creditedAt),
    });
  }
  if (entry.status === "CANCELLED") return LABELS.cashbackNotCredited;
  return entry.expectedCreditOn
    ? formatLabel(LABELS.cashbackExpectedOn, {
        date: formatDate(entry.expectedCreditOn),
      })
    : LABELS.cashbackAfterDelivery;
}

/** Where it came from: coupon codes and/or the platform offer. */
export function cashbackSource(entry: CashbackEntry): string[] {
  return [
    ...entry.couponCodes.map((code) =>
      formatLabel(LABELS.cashbackFromCoupon, { code }),
    ),
    ...(entry.offerName ? [entry.offerName] : []),
  ];
}

export function buildCashbackHistoryColumns(): DataTableColumn<CashbackEntry>[] {
  return [
    {
      id: "order",
      header: LABELS.cashbackOrder,
      truncate: false,
      cell: (row) => (
        <Link href={PATHS.order(row.orderId)} className={styles.orderLink}>
          #{shortOrderId(row.orderId)}
        </Link>
      ),
    },
    {
      id: "placed",
      header: LABELS.cashbackPlaced,
      cell: (row) => formatDate(row.placedAt),
    },
    {
      id: "amount",
      header: LABELS.cashbackAmount,
      cell: (row) => formatInr(row.amount),
    },
    {
      id: "status",
      header: LABELS.cashbackStatus,
      truncate: false,
      cell: (row) => (
        <StatusBadge status={row.status} label={STATUS_LABEL[row.status]} />
      ),
    },
    { id: "when", header: LABELS.cashbackWhen, cell: cashbackWhen },
    {
      id: "from",
      header: LABELS.cashbackFrom,
      cell: (row) => cashbackSource(row).join(" · ") || "—",
    },
  ];
}
