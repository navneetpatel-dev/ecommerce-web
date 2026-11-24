"use client";

import {
  fieldLabel,
  isMoneyKey,
} from "@/shared/utils/formatting/recordDetails";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

interface RecordDetailHighlightsProps {
  record: Record<string, unknown>;
}

const HIGHLIGHT_KEYS = [
  "totalAmount",
  "grandTotal",
  "currentBalance",
  "refundAmount",
  "walletRefundAmount",
  "razorpayRefundAmount",
  "subtotal",
  "amount",
  "price",
  "discountValue",
  "lowStockAt",
  "permissionsCount",
];

export function RecordDetailHighlights({
  record,
}: RecordDetailHighlightsProps) {
  const highlights: { key: string; label: string; value: string }[] = [];

  for (const k of HIGHLIGHT_KEYS) {
    if (highlights.length >= 4) break;
    const raw = record[k];
    if (raw == null || raw === "") continue;

    if (isMoneyKey(k)) {
      const num = Number(raw);
      if (!isNaN(num)) {
        highlights.push({
          key: k,
          label: fieldLabel(k),
          value: formatInr(num),
        });
      }
    } else if (typeof raw === "number") {
      highlights.push({
        key: k,
        label: fieldLabel(k),
        value: String(raw),
      });
    }
  }

  if (highlights.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {highlights.map((h) => (
        <div
          key={h.key}
          className="flex flex-col justify-between gap-1.5 rounded-xl border border-line/70 bg-surface-subtle/50 p-3.5 shadow-sm transition-colors hover:border-line"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted truncate">
            {h.label}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-ink tracking-tight truncate">
            {h.value}
          </span>
        </div>
      ))}
    </div>
  );
}
