import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import type { Category } from "@/shared/api/types";

interface CategoryHeaderProps {
  category: Category;
  breadcrumbItems: Array<{ label: string; href: string }>;
  slugPath: string[];
}

export function CategoryHeader({
  category,
  breadcrumbItems,
  slugPath,
}: CategoryHeaderProps) {
  const childLinks = category.children ?? [];

  return (
    <header className="mb-3 sm:mb-4 md:mb-5">
      <Breadcrumbs items={breadcrumbItems} className="mb-1.5 sm:mb-2" />

      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:gap-6 xl:gap-8">
        <div className="min-w-0 shrink-0 lg:max-w-[min(100%,22rem)] xl:max-w-[min(100%,28rem)]">
          <h1
            className="font-display font-semibold tracking-tight text-ink"
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.15 }}
          >
            {category.name}
          </h1>
          {category.seoDescription ? (
            <p
              className="mt-1 line-clamp-2 max-w-2xl text-ink-muted sm:line-clamp-none"
              style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.4 }}
            >
              {category.seoDescription}
            </p>
          ) : null}
        </div>

        {childLinks.length > 0 ? (
          <nav
            aria-label={LABELS.shopInCategory}
            className="min-w-0 flex-1 lg:pt-0.5"
          >
            <p className="mb-1.5 text-eyebrow leading-none lg:text-right">
              {LABELS.shopInCategory}
            </p>
            <ul className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-4 pb-0.5 [scrollbar-width:none] touch-pan-x sm:mx-0 sm:px-0 lg:justify-end [&::-webkit-scrollbar]:hidden">
              {childLinks.map((child) => (
                <li key={child.id} className="shrink-0">
                  <Link
                    href={PATHS.category(...slugPath, child.slug)}
                    title={formatLabel(LABELS.shopCategory, {
                      name: child.name,
                    })}
                    aria-label={formatLabel(LABELS.shopCategory, {
                      name: child.name,
                    })}
                    className={cn(
                      "group inline-flex h-8 items-center gap-0.5 rounded-md border border-line bg-surface px-2.5",
                      "text-[0.8125rem] font-medium text-ink shadow-[0_1px_0_rgba(15,23,42,0.04)]",
                      "transition-colors hover:border-brand hover:bg-brand-subtle hover:text-brand",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    )}
                  >
                    <span>{child.name}</span>
                    <ChevronRight
                      className="h-3.5 w-3.5 text-ink-faint transition-colors group-hover:text-brand"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
