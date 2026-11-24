"use client";

import { Sliders } from "lucide-react";

interface ProductSpecsCardProps {
  product: Record<string, unknown>;
}

export function ProductSpecsCard({ product }: ProductSpecsCardProps) {
  const specs =
    product.specs && typeof product.specs === "object"
      ? Object.entries(product.specs as Record<string, unknown>).filter(
          ([_, v]) => v != null && v !== "",
        )
      : [];

  if (specs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-line/60">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <Sliders className="size-4 text-brand" aria-hidden />
          <span>Technical Specifications</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-paper border border-line text-ink-muted">
          {specs.length} {specs.length === 1 ? "spec" : "specs"}
        </span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {specs.map(([specKey, specVal]) => (
          <div
            key={specKey}
            className="flex flex-col gap-0.5 p-2.5 rounded-xl border border-line/50 bg-paper/60"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted/80 truncate">
              {specKey}
            </dt>
            <dd className="text-body-xs font-medium text-ink break-words">
              {String(specVal)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
