"use client";

import { Calendar, Percent, Shield } from "lucide-react";
import type { CategoryModalTarget } from "./CategoryDetailModal.component";

interface ProductCategoryMetricsProps {
  category: Record<string, unknown> | null;
  secondaryCategories: Array<{ id?: string; name?: string; slug?: string }>;
  onSelectCategory: (target: CategoryModalTarget) => void;
}

export function ProductCategoryMetrics({
  category,
  secondaryCategories,
  onSelectCategory,
}: ProductCategoryMetricsProps) {
  const metrics = [
    {
      show: category?.commissionRate != null,
      Icon: Percent,
      label: "Default Commission",
      val: `${Number(category?.commissionRate)}%`,
    },
    {
      show: category?.returnWindowDays != null,
      Icon: Calendar,
      label: "Category Return Window",
      val: `${Number(category?.returnWindowDays)} Days`,
    },
    {
      show: category?.defaultWarrantyMonths != null,
      Icon: Shield,
      label: "Default Warranty",
      val: `${String(category?.defaultWarrantyMonths)} Months`,
    },
  ].filter((m) => m.show);

  return (
    <>
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1"
            >
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                <m.Icon className="size-3" />
                <span>{m.label}</span>
              </div>
              <p className="text-xs text-ink font-mono font-bold">{m.val}</p>
            </div>
          ))}
        </div>
      )}

      {secondaryCategories.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Secondary & Cross-Listed Categories
          </span>
          <div className="flex flex-wrap gap-1.5">
            {secondaryCategories.map((sc, i) => {
              const scName = sc.name ?? sc.slug ?? "";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    onSelectCategory({
                      id: sc.id ?? null,
                      name: scName,
                      slug: sc.slug ?? null,
                      preview: sc as unknown as Record<string, unknown>,
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-[11px] font-medium text-ink-muted border border-line hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all cursor-pointer"
                >
                  <span>{scName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
