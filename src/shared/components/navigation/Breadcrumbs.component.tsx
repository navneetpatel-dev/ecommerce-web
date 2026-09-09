import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { LABELS } from "@/shared/constants/labels";
import { breadcrumbStyles } from "../../styles/navigation/navigationComponents.styles";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Compact trail navigation — visually quieter than page title / body copy. */
function BreadcrumbEntry({
  item,
  isFirst,
  isLast,
}: {
  item: BreadcrumbItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const separator = !isFirst && (
    <ChevronRight
      className={breadcrumbStyles.separator}
      strokeWidth={1.75}
      aria-hidden
    />
  );
  const ariaCurrent = isLast ? "page" : undefined;
  const isPlainLabel = isLast || !item.href;
  const label = isPlainLabel ? (
    <span
      className={cn(isLast && breadcrumbStyles.lastLabel)}
      aria-current={ariaCurrent}
    >
      {item.label}
    </span>
  ) : (
    <Link href={item.href!} className={breadcrumbStyles.link}>
      {item.label}
    </Link>
  );

  return (
    <span className={breadcrumbStyles.entry}>
      {separator}
      {label}
    </span>
  );
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const entries = items.map((item, i) => (
    <BreadcrumbEntry
      key={`${item.label}-${i}`}
      item={item}
      isFirst={i === 0}
      isLast={i === items.length - 1}
    />
  ));

  return (
    <nav
      aria-label={LABELS.breadcrumb}
      className={cn(breadcrumbStyles.nav, className)}
    >
      {entries}
    </nav>
  );
}
