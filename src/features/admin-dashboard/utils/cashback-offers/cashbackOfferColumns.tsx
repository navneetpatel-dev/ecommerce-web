import type { CashbackOffer, CashbackOfferState } from "@/features/cashback";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

const STATE_LABEL: Record<CashbackOfferState, string> = {
  LIVE: LABELS.cashbackOfferStateLIVE,
  SCHEDULED: LABELS.cashbackOfferStateSCHEDULED,
  ENDED: LABELS.cashbackOfferStateENDED,
  OFF: LABELS.cashbackOfferStateOFF,
};

/** Status-badge tone keys the shared badge already understands. */
const STATE_TONE: Record<CashbackOfferState, string> = {
  LIVE: "ACTIVE",
  SCHEDULED: "PENDING",
  ENDED: "EXPIRED",
  OFF: "INACTIVE",
};

export function cashbackOfferRule(offer: CashbackOffer): string {
  return formatLabel(LABELS.cashbackOfferRule, {
    percent: offer.percent,
    cap:
      offer.maxCashback == null
        ? LABELS.cashbackOfferNoCap
        : formatLabel(LABELS.cashbackBadgeUpTo, {
            amount: formatInr(offer.maxCashback),
          }),
    min:
      offer.minOrderValue > 0
        ? formatLabel(LABELS.cashbackBadgeAbove, {
            amount: formatInr(offer.minOrderValue),
          })
        : LABELS.cashbackOfferNoMinimum,
  });
}

export function cashbackOfferScope(offer: CashbackOffer): string {
  const categories =
    offer.categoryIds.length === 0
      ? LABELS.cashbackOfferAllCategories
      : `${LABELS.cashbackOfferCategories}: ${offer.categoryIds.length}`;
  const payments =
    offer.paymentMethods.length === 0
      ? LABELS.cashbackOfferAllPayments
      : offer.paymentMethods
          .map((method) =>
            method === "COD"
              ? LABELS.cashbackOfferPayCod
              : LABELS.cashbackOfferPayOnline,
          )
          .join(", ");
  return `${categories} · ${payments}`;
}

export function buildCashbackOfferColumns(): DataTableColumn<CashbackOffer>[] {
  return [
    { id: "name", header: LABELS.cashbackOfferName, cell: (row) => row.name },
    {
      id: "state",
      header: LABELS.cashbackStatus,
      truncate: false,
      cell: (row) => (
        <StatusBadge
          status={STATE_TONE[row.state]}
          label={STATE_LABEL[row.state]}
        />
      ),
    },
    { id: "rule", header: LABELS.cashbackOfferRules, cell: cashbackOfferRule },
    {
      id: "scope",
      header: LABELS.cashbackOfferScope,
      cell: cashbackOfferScope,
    },
    {
      id: "window",
      header: LABELS.cashbackOfferWindow,
      cell: (row) =>
        row.endsAt
          ? `${formatDate(row.startsAt)} – ${formatDate(row.endsAt)}`
          : formatDate(row.startsAt),
    },
  ];
}
