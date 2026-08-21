"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CashbackCouponNoticeProps {
  payNow: number;
  cashbackAmount: number;
  code?: string | null;
  className?: string;
}

function formatInr(value: number) {
  return `₹${formatInrAmount(value)}`;
}

export function CashbackCouponNotice({
  payNow,
  cashbackAmount,
  code,
  className,
}: CashbackCouponNoticeProps) {
  if (cashbackAmount <= 0) return null;

  return (
    <p className={className ?? "text-[0.8125rem] text-brand"}>
      {code ? `${formatLabel(LABELS.couponCashbackApplied, { code })} · ` : ""}
      {formatLabel(LABELS.cashbackPayNowMessage, {
        payNow: formatInr(payNow),
        cashback: formatInr(cashbackAmount),
      })}
    </p>
  );
}
