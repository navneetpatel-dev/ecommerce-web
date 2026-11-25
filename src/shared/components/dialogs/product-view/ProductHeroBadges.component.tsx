"use client";

import { ExternalLink, Tag } from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { PATHS } from "@/shared/constants/paths/paths";
import type { CategoryModalTarget } from "./CategoryDetailModal.component";

interface ProductHeroBadgesProps {
  status: string | null;
  statusFilterUrl: string;
  isPending: boolean;
  brand: string | null;
  categoryName: string | null;
  categoryId: string | null;
  category: Record<string, unknown> | null;
  onCategoryClick?: (target: CategoryModalTarget) => void;
}

export function ProductHeroBadges({
  status,
  statusFilterUrl,
  isPending,
  brand,
  categoryName,
  categoryId,
  category,
  onCategoryClick,
}: ProductHeroBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status && (
        <a
          href={statusFilterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={
            isPending
              ? "Open Pending Review queue in new tab"
              : `Filter products with status "${status}" in Admin catalog in new tab`
          }
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={status} />
        </a>
      )}
      {brand && (
        <a
          href={`${PATHS.admin.products}?tab=all&search=${encodeURIComponent(brand)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Search brand in Admin catalog in new tab"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand text-[11px] font-semibold border border-brand/30 hover:bg-brand hover:text-paper hover:border-brand transition-all"
        >
          <span>{brand}</span>
          <ExternalLink className="size-2.5 opacity-70" />
        </a>
      )}
      {categoryName &&
        (onCategoryClick ? (
          <button
            type="button"
            onClick={() =>
              onCategoryClick({
                id: categoryId,
                name: categoryName,
                preview: category,
              })
            }
            title="Open category details modal"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface text-ink-muted text-[11px] font-medium border border-line hover:bg-brand-subtle hover:text-ink hover:border-brand/40 transition-all cursor-pointer"
          >
            <Tag className="size-3" />
            <span>{categoryName}</span>
          </button>
        ) : (
          <a
            href={
              categoryId
                ? `${PATHS.admin.products}?tab=all&categoryId=${categoryId}`
                : `${PATHS.admin.products}?tab=all&search=${encodeURIComponent(categoryName)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface text-ink-muted text-[11px] font-medium border border-line hover:bg-brand-subtle hover:text-ink hover:border-brand/40 transition-all"
          >
            <Tag className="size-3" />
            <span>{categoryName}</span>
            <ExternalLink className="size-2.5 opacity-70" />
          </a>
        ))}
    </div>
  );
}
