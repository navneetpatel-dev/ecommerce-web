import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";
import { resolveCategoryIcon, categoryHref } from "@/features/categories";
import { cn } from "@/shared/utils/cn";

interface MobileNavCategoryTreeProps {
  categories: Category[];
  onNavigate: () => void;
}

/** Three-level (department → category → subcategory) mobile nav category tree. */
export function MobileNavCategoryTree({
  categories,
  onNavigate,
}: MobileNavCategoryTreeProps) {
  return (
    <>
      <div className="mt-4 px-3 py-2 flex items-center justify-between">
        <span className="text-body-sm font-medium text-ink-muted">
          {LABELS.categories}
        </span>
        {categories.length > 0 ? (
          <Link
            href={PATHS.categories}
            onClick={onNavigate}
            className="inline-flex items-center gap-0.5 text-[0.75rem] font-medium text-brand"
          >
            {LABELS.viewAll} <ArrowRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>

      {categories.length === 0 ? (
        <p className="px-3 py-2 text-body-sm text-ink-faint">
          {LABELS.noCategoriesYet}
        </p>
      ) : (
        <ul className="space-y-1">
          {categories.map((department) => {
            const Icon = resolveCategoryIcon(department);
            return (
              <li key={department.id}>
                <Link
                  href={categoryHref(department, categories)}
                  onClick={onNavigate}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body font-medium hover:bg-paper transition-colors"
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-ink-muted"
                    strokeWidth={1.5}
                  />
                  <span className="truncate">{department.name}</span>
                </Link>
                {department.children?.length ? (
                  <ul className="ml-4 space-y-0.5 border-l border-line pl-2">
                    {department.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={categoryHref(child, categories)}
                          onClick={onNavigate}
                          className="block truncate rounded-md px-2 py-1.5 text-body-sm font-medium text-ink-muted hover:bg-paper hover:text-ink"
                        >
                          {child.name}
                        </Link>
                        {child.children?.length ? (
                          <ul className="ml-2 space-y-0.5">
                            {child.children.map((leaf) => (
                              <li key={leaf.id}>
                                <Link
                                  href={categoryHref(leaf, categories)}
                                  onClick={onNavigate}
                                  className={cn(
                                    "block truncate rounded-md px-2 py-1 text-[0.75rem] text-ink-faint hover:bg-paper hover:text-ink",
                                  )}
                                >
                                  {leaf.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
