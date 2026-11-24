"use client";

import {
  FolderTree,
  ExternalLink,
  ChevronRight,
  Percent,
  Calendar,
  Shield,
} from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";

interface ProductCategoryCardProps {
  product: Record<string, unknown>;
}

export function ProductCategoryCard({ product }: ProductCategoryCardProps) {
  const category = (product.category as Record<string, unknown>) ?? null;
  const categoryName =
    typeof category?.name === "string"
      ? category.name
      : typeof product.categoryName === "string"
        ? product.categoryName
        : null;

  const categorySlug =
    typeof category?.slug === "string"
      ? category.slug
      : typeof product.categorySlug === "string"
        ? product.categorySlug
        : null;

  const categoryStatus =
    typeof category?.status === "string" ? category.status : null;
  const description =
    typeof category?.description === "string" ? category.description : null;
  const parent = (category?.parent as Record<string, unknown>) ?? null;
  const parentName = typeof parent?.name === "string" ? parent.name : null;
  const parentSlug = typeof parent?.slug === "string" ? parent.slug : null;

  const commissionRate = category?.commissionRate;
  const returnWindowDays = category?.returnWindowDays;
  const defaultWarrantyMonths = category?.defaultWarrantyMonths;

  const secondaryCategories = Array.isArray(product.secondaryCategories)
    ? (product.secondaryCategories as Array<{ name?: string; slug?: string }>)
    : [];

  if (!categoryName && secondaryCategories.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line/60 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <FolderTree className="size-4 text-brand" aria-hidden />
          <span>Category & Taxonomy Details</span>
        </div>

        <div className="flex items-center gap-2">
          {categoryStatus && <StatusBadge status={categoryStatus} />}
          <a
            href={PATHS.categories}
            target="_blank"
            rel="noopener noreferrer"
            title="Browse all categories in new tab"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
          >
            <span>All Categories</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-line/60 bg-paper/60 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {parentName && (
            <div className="inline-flex items-center gap-1 text-xs text-ink-muted">
              {parentSlug ? (
                <a
                  href={PATHS.category(parentSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:underline"
                >
                  {parentName}
                </a>
              ) : (
                <span>{parentName}</span>
              )}
              <ChevronRight className="size-3 text-ink-muted/60" />
            </div>
          )}

          {categorySlug ? (
            <a
              href={PATHS.category(categorySlug)}
              target="_blank"
              rel="noopener noreferrer"
              title="Open category page in new tab"
              className="font-bold text-base text-ink hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{categoryName}</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          ) : (
            <span className="font-bold text-base text-ink">{categoryName}</span>
          )}
        </div>

        {categorySlug && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
            <span>slug: {categorySlug}</span>
            <RecordDetailCopyButton
              value={categorySlug}
              label="Copy category slug"
            />
          </div>
        )}

        {description && (
          <p className="text-xs text-ink-muted pt-1 leading-relaxed border-t border-line/40">
            {description}
          </p>
        )}
      </div>

      {(commissionRate != null ||
        returnWindowDays != null ||
        defaultWarrantyMonths != null) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {commissionRate != null && (
            <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                <Percent className="size-3" />
                <span>Default Commission</span>
              </div>
              <p className="font-mono font-bold text-xs text-ink">
                {Number(commissionRate)}%
              </p>
            </div>
          )}

          {returnWindowDays != null && (
            <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                <Calendar className="size-3" />
                <span>Category Return Window</span>
              </div>
              <p className="font-medium text-xs text-ink">
                {Number(returnWindowDays)} Days
              </p>
            </div>
          )}

          {defaultWarrantyMonths != null && (
            <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                <Shield className="size-3" />
                <span>Default Warranty</span>
              </div>
              <p className="font-medium text-xs text-ink">
                {String(defaultWarrantyMonths)} Months
              </p>
            </div>
          )}
        </div>
      )}

      {secondaryCategories.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Secondary & Cross-Listed Categories
          </span>
          <div className="flex flex-wrap gap-1.5">
            {secondaryCategories.map((sc, i) => (
              <a
                key={i}
                href={sc.slug ? PATHS.category(sc.slug) : PATHS.categories}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${sc.name ?? sc.slug} in new tab`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-[11px] font-medium text-ink-muted border border-line hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all"
              >
                <span>{sc.name ?? sc.slug}</span>
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
