"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { MediaImage } from "@/shared/components/MediaImage";
import {
  categoryHref,
  resolveCategoryIcon,
  resolveCategoryImageUrl,
} from "../../utils/categoryHelpers";
import type { Category } from "@/shared/api/types";

const MAX_VISIBLE_CHILDREN = 5;

interface CategoryMegaMenuTileProps {
  department: Category;
  tree: Category[];
  onClose: () => void;
}

export function CategoryMegaMenuTile({
  department,
  tree,
  onClose,
}: CategoryMegaMenuTileProps) {
  const Icon = resolveCategoryIcon(department);
  const imageUrl = resolveCategoryImageUrl(department);
  const children = department.children ?? [];
  const visibleChildren = children.slice(0, MAX_VISIBLE_CHILDREN);
  const hiddenCount = Math.max(0, children.length - visibleChildren.length);

  return (
    <li className="min-w-0">
      <div
        className={cn(
          "group/tile h-full rounded-lg border border-line bg-paper/40 p-3 transition-all duration-200",
          "hover:border-brand/30 hover:bg-paper hover:shadow-elevation-1",
        )}
      >
        <Link
          href={categoryHref(department, tree)}
          onClick={onClose}
          className="mb-3 flex items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle text-brand transition-colors group-hover/tile:bg-brand group-hover/tile:text-paper">
            {imageUrl ? (
              <MediaImage
                src={imageUrl}
                alt=""
                unavailableLabel={formatLabel(LABELS.categoryImageUnavailable, {
                  name: department.name,
                })}
                sizes="44px"
                imageClassName="object-cover"
                className="absolute inset-0"
              />
            ) : (
              <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            )}
          </span>
          <span className="min-w-0 flex-1 pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[0.875rem] font-semibold text-ink transition-colors group-hover/tile:text-brand">
                {department.name}
              </span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-all group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:opacity-100 group-hover/tile:text-brand"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            {children.length ? (
              <span className="mt-0.5 block text-[0.6875rem] text-ink-faint">
                {formatLabel(
                  children.length === 1
                    ? LABELS.categoryChildCountSingular
                    : LABELS.categoryChildCountPlural,
                  { count: children.length },
                )}
              </span>
            ) : null}
          </span>
        </Link>

        {visibleChildren.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {visibleChildren.map((child) => (
              <li key={child.id}>
                <Link
                  href={categoryHref(child, tree)}
                  onClick={onClose}
                  className={cn(
                    "inline-flex max-w-full items-center rounded-full border border-line bg-surface px-2.5 py-1",
                    "text-[0.6875rem] font-medium text-ink-muted transition-colors",
                    "hover:border-brand/25 hover:bg-brand-subtle hover:text-brand",
                  )}
                >
                  <span className="truncate">{child.name}</span>
                </Link>
              </li>
            ))}
            {hiddenCount > 0 ? (
              <li>
                <Link
                  href={categoryHref(department, tree)}
                  onClick={onClose}
                  className="inline-flex items-center rounded-full px-2 py-1 text-[0.6875rem] font-medium text-brand hover:underline"
                >
                  +{hiddenCount}
                </Link>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
