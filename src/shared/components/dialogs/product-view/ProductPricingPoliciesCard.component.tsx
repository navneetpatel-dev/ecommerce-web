"use client";

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

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-line/60 text-ink font-semibold text-body-sm">
        <ShieldCheck className="size-4 text-brand" aria-hidden />
        <span>Pricing, Policies & Compliance</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {hsnCode && (
          <div className="p-3 rounded-xl border border-line/50 bg-paper/60 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              HSN Code
            </span>
            <div className="flex items-center justify-between font-mono font-medium text-xs text-ink">
              <span>{hsnCode}</span>
              <RecordDetailCopyButton value={hsnCode} label="Copy HSN" />
            </div>
          </div>
        )}

        {gstRate != null && (
          <div className="p-3 rounded-xl border border-line/50 bg-paper/60 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              GST Rate
            </span>
            <p className="font-mono font-medium text-xs text-ink">
              {Number(gstRate)}%
            </p>
          </div>
        )}

        <div className="p-3 rounded-xl border border-line/50 bg-paper/60 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Cash on Delivery
          </span>
          <p className="font-medium text-xs text-ink">
            {codEnabled === false ? "Disabled" : "Available"}
          </p>
        </div>

        <div className="p-3 rounded-xl border border-line/50 bg-paper/60 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Returns & Refunds
          </span>
          <p className="font-medium text-xs text-ink">
            {returnsAllowed === false
              ? "Non-returnable"
              : returnWindow != null
                ? `${returnWindow} Days Window`
                : "Eligible"}
          </p>
        </div>

        {returnShippingFee != null && Number(returnShippingFee) > 0 && (
          <div className="p-3 rounded-xl border border-line/50 bg-paper/60 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Return Shipping Fee
            </span>
            <p className="font-mono font-medium text-xs text-ink">
              {formatInr(Number(returnShippingFee))}
            </p>
          </div>
        )}

        {warrantyMonths != null && Number(warrantyMonths) > 0 && (
          <div className="p-3 rounded-xl border border-line/50 bg-paper/60 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Warranty
            </span>
            <p className="font-medium text-xs text-ink">
              {String(warrantyMonths)} Months{" "}
              {warrantyType ? `(${String(warrantyType)})` : ""}
            </p>
          </div>
        )}
      </div>

      {(deliveryNote || returnNote) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-line/40 text-xs">
          {deliveryNote && (
            <div className="p-3 rounded-xl bg-surface-subtle/50 border border-line/50 space-y-1">
              <span className="font-semibold text-ink-muted uppercase text-[10px]">
                Delivery Note
              </span>
              <p className="text-ink/80">{deliveryNote}</p>
            </div>
          )}
          {returnNote && (
            <div className="p-3 rounded-xl bg-surface-subtle/50 border border-line/50 space-y-1">
              <span className="font-semibold text-ink-muted uppercase text-[10px]">
                Return Policy Note
              </span>
              <p className="text-ink/80">{returnNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
