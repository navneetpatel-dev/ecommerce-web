"use client";

import type { DisplayAmountInput } from "@/shared/utils/formatting/displayAmount";
import { ShieldCheck } from "lucide-react";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";

interface ProductPricingPoliciesCardProps {
  product: Record<string, unknown>;
}

export function ProductPricingPoliciesCard({
  product,
}: ProductPricingPoliciesCardProps) {
  const hsnCode = typeof product.hsnCode === "string" ? product.hsnCode : null;
  const gstRate =
    product.gstPercentage ?? product.gstPercentageAbove ?? product.taxRate;
  const codEnabled = product.codEnabled;
  const returnsAllowed = product.returnsAllowed;
  const returnWindow = product.returnWindowDays;
  const returnShippingFee = product.returnShippingFee;
  const warrantyMonths = product.warrantyMonths;
  const warrantyType = product.warrantyType;
  const deliveryNote =
    typeof product.deliveryNote === "string" ? product.deliveryNote : null;
  const returnNote =
    typeof product.returnNote === "string" ? product.returnNote : null;

  const rows = [
    hsnCode
      ? {
          label: "HSN Code",
          value: (
            <span className="inline-flex items-center gap-1.5 font-mono">
              <span>{hsnCode}</span>
              <RecordDetailCopyButton value={hsnCode} label="Copy HSN" />
            </span>
          ),
        }
      : null,
    gstRate != null
      ? {
          label: "GST Rate",
          value: <span className="font-mono">{Number(gstRate)}%</span>,
        }
      : null,
    {
      label: "Cash on Delivery",
      value: codEnabled === false ? "Disabled" : "Available",
    },
    {
      label: "Returns & Refunds",
      value:
        returnsAllowed === false
          ? "Non-returnable"
          : returnWindow != null
            ? `${returnWindow} Days Window`
            : "Eligible",
    },
    returnShippingFee != null && Number(returnShippingFee) > 0
      ? {
          label: "Return Shipping Fee",
          value: (
            <span className="font-mono">
              {formatInr(returnShippingFee as DisplayAmountInput)}
            </span>
          ),
        }
      : null,
    warrantyMonths != null
      ? {
          label: "Warranty",
          value: `${warrantyMonths} Months${warrantyType ? ` (${String(warrantyType)})` : ""}`,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: React.ReactNode }>;

  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-2 pb-2 border-b border-line/60 text-ink-muted font-semibold text-xs uppercase tracking-wider">
        <ShieldCheck className="size-3.5 text-brand" aria-hidden />
        <span>Pricing, Policies & Compliance</span>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-4 border-b border-line/40 py-2.5"
          >
            <dt className="text-xs font-medium text-ink-muted shrink-0">
              {r.label}
            </dt>
            <dd className="text-body-sm font-medium text-ink text-right min-w-0">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {(deliveryNote || returnNote) && (
        <div className="space-y-2 pt-1">
          {deliveryNote && (
            <div className="rounded-xl border-l-2 border-brand bg-paper/55 px-4 py-2.5 space-y-0.5">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Delivery Note
              </span>
              <p className="text-body-xs text-ink leading-relaxed">
                {deliveryNote}
              </p>
            </div>
          )}
          {returnNote && (
            <div className="rounded-xl border-l-2 border-brand bg-paper/55 px-4 py-2.5 space-y-0.5">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Return Policy Note
              </span>
              <p className="text-body-xs text-ink leading-relaxed">
                {returnNote}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
