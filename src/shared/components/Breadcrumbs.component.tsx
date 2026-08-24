import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Compact trail navigation — visually quieter than page title / body copy. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label={LABELS.breadcrumb}
      className={cn(
        "flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.75rem] leading-none text-ink-faint",
        className,
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span
            key={`${item.label}-${i}`}
            className="inline-flex items-center gap-1"
          >
            {i > 0 ? (
              <ChevronRight
                className="h-3 w-3 shrink-0 text-ink-faint/70"
                strokeWidth={1.75}
                aria-hidden
              />
            ) : null}
            {isLast || !item.href ? (
              <span
                className={cn(isLast && "font-medium text-ink-muted")}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
