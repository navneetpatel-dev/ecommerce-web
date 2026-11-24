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
  const categoryName = (
    typeof category?.name === "string" ? category.name : product.categoryName
  ) as string | null;
  const categorySlug = (
    typeof category?.slug === "string" ? category.slug : product.categorySlug
  ) as string | null;
  const categoryId = (
    typeof category?.id === "string" ? category.id : product.categoryId
  ) as string | null;
  const categoryStatus =
    typeof category?.status === "string" ? category.status : null;
  const isCategoryActive = categoryStatus === "ACTIVE";
  const description =
    typeof category?.description === "string" ? category.description : null;
  const parent = (category?.parent as Record<string, unknown>) ?? null;
  const parentName = typeof parent?.name === "string" ? parent.name : null;
  const parentSlug = typeof parent?.slug === "string" ? parent.slug : null;
  const commissionRate = category?.commissionRate,
    returnWindowDays = category?.returnWindowDays;
  const defaultWarrantyMonths = category?.defaultWarrantyMonths;
  const secondaryCategories = Array.isArray(product.secondaryCategories)
    ? (product.secondaryCategories as Array<{ name?: string; slug?: string }>)
    : [];

  if (!categoryName && secondaryCategories.length === 0) return null;

  const parentUrl =
    isCategoryActive && parentSlug
      ? PATHS.category(parentSlug)
      : `${PATHS.admin.products}?tab=all&search=${encodeURIComponent(parentName ?? "")}`;

  const categoryUrl =
    isCategoryActive && categorySlug
      ? parentSlug
        ? PATHS.category(parentSlug, categorySlug)
        : PATHS.category(categorySlug)
      : `${PATHS.admin.products}?tab=all${categoryId ? `&categoryId=${categoryId}` : ""}&search=${encodeURIComponent(categoryName ?? "")}`;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line/60 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <FolderTree className="size-4 text-brand" aria-hidden />
          <span>Category & Taxonomy Details</span>
        </div>

        <div className="flex items-center gap-2">
          {categoryStatus && <StatusBadge status={categoryStatus} />}
          {categoryId && (
            <a
              href={`${PATHS.admin.products}?tab=all&categoryId=${categoryId}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Filter and view all products in this category in new tab"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
            >
              <span>Filter Products</span>
              <ExternalLink className="size-3" />
            </a>
          )}
          <a
            href={PATHS.admin.categories}
            target="_blank"
            rel="noopener noreferrer"
            title="Browse all categories in Admin in new tab"
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
              <a
                href={parentUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={
                  isCategoryActive && parentSlug
                    ? "Open parent category on storefront in new tab"
                    : "Search parent category in Admin in new tab"
                }
                className="hover:text-brand hover:underline"
              >
                {parentName}
              </a>
              <ChevronRight className="size-3 text-ink-muted/60" />
            </div>
          )}

          <a
            href={categoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={
              isCategoryActive && categorySlug
                ? "Open category on storefront in new tab"
                : "Search category in Admin catalog in new tab"
            }
            className="font-bold text-base text-ink hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{categoryName}</span>
            <ExternalLink className="size-3.5 opacity-60" />
          </a>
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
          {[
            {
              show: commissionRate != null,
              Icon: Percent,
              label: "Default Commission",
              val: `${Number(commissionRate)}%`,
              mono: true,
            },
            {
              show: returnWindowDays != null,
              Icon: Calendar,
              label: "Category Return Window",
              val: `${Number(returnWindowDays)} Days`,
              mono: false,
            },
            {
              show: defaultWarrantyMonths != null,
              Icon: Shield,
              label: "Default Warranty",
              val: `${String(defaultWarrantyMonths)} Months`,
              mono: false,
            },
          ]
            .filter((m) => m.show)
            .map((m) => (
              <div
                key={m.label}
                className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1"
              >
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  <m.Icon className="size-3" />
                  <span>{m.label}</span>
                </div>
                <p
                  className={`text-xs text-ink ${m.mono ? "font-mono font-bold" : "font-medium"}`}
                >
                  {m.val}
                </p>
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
              const name = sc.name ?? sc.slug ?? "";
              return (
                <a
                  key={i}
                  href={`${PATHS.admin.products}?tab=all&search=${encodeURIComponent(name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Find products in ${name} in Admin catalog in new tab`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-[11px] font-medium text-ink-muted border border-line hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all"
                >
                  <span>{name}</span>
                  <ExternalLink className="size-2.5 opacity-60" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
