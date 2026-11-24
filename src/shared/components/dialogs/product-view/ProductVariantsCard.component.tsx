"use client";

import { ExternalLink, Layers } from "lucide-react";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { PATHS } from "@/shared/constants/paths/paths";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";

interface VariantAttributeMap {
  [key: string]: string;
}

interface ProductVariantItem {
  id?: string;
  sku?: string;
  price?: number;
  stock?: number;
  lowStockAt?: number;
  displayPrice?: number;
  attributes?: VariantAttributeMap;
  weightGrams?: number;
}

interface ProductVariantsCardProps {
  product: Record<string, unknown>;
}

export function ProductVariantsCard({ product }: ProductVariantsCardProps) {
  const variants = Array.isArray(product.variants)
    ? (product.variants as ProductVariantItem[])
    : [];

  if (variants.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-line/60">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <Layers className="size-4 text-brand" aria-hidden />
          <span>Variants & Inventory Matrix</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-paper border border-line text-ink-muted">
          {variants.length} {variants.length === 1 ? "variant" : "variants"}
        </span>
      </div>

      <div className="space-y-2">
        {variants.map((v, idx) => {
          const sku = v.sku ?? `Variant ${idx + 1}`;
          const price = v.displayPrice ?? v.price;
          const stock = v.stock ?? 0;
          const lowStockAt = v.lowStockAt;
          const attributes =
            v.attributes && typeof v.attributes === "object"
              ? Object.entries(v.attributes)
              : [];

          return (
            <div
              key={v.id ?? idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-line/60 bg-paper/60 hover:border-line transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`${PATHS.admin.inventory}?search=${encodeURIComponent(sku)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Search ${sku} in Admin Inventory in new tab`}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-ink bg-surface-subtle px-2 py-0.5 rounded border border-line/70 hover:border-brand hover:text-brand transition-colors"
                  >
                    <span>{sku}</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                  <RecordDetailCopyButton value={sku} label="Copy SKU" />

                  {attributes.map(([attrKey, attrVal]) => (
                    <span
                      key={attrKey}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-surface text-ink-muted border border-line"
                    >
                      <strong className="text-ink font-medium">
                        {attrKey}:
                      </strong>{" "}
                      <span>{attrVal}</span>
                    </span>
                  ))}
                </div>

                {v.weightGrams != null && (
                  <p className="text-[11px] text-ink-muted">
                    Weight: {v.weightGrams}g
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                {price != null && (
                  <span className="font-mono font-bold text-sm text-ink tabular-nums">
                    {formatInr(Number(price))}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    stock === 0
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      : lowStockAt != null && stock <= lowStockAt
                        ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                  }`}
                >
                  {stock === 0 ? "Out of Stock" : `${stock} in stock`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
