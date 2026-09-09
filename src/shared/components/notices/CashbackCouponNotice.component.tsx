"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

interface CashbackCouponNoticeProps {
  payNow: number;
  cashbackAmount: number;
  code?: string | null;
  className?: string;
}

export function CashbackCouponNotice({
  payNow,
  cashbackAmount,
  code,
  className,
}: CashbackCouponNoticeProps) {
  if (cashbackAmount <= 0) return null;

  return (
    <p className={className ?? "text-body-sm text-brand"}>
      {code ? `${formatLabel(LABELS.couponCashbackApplied, { code })} · ` : ""}
      {formatLabel(LABELS.cashbackPayNowMessage, {
        payNow: formatInr(payNow),
        cashback: formatInr(cashbackAmount),
      })}
    </p>
  );
}
