"use client";

import Link from "next/link";
import { ChevronRight, type Heart } from "lucide-react";

export function SummaryRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Heart;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <Icon
          size={16}
          strokeWidth={1.5}
          className="shrink-0 text-ink-muted"
          aria-hidden
        />
        <span className="block text-body text-ink">{label}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="text-[0.875rem] font-medium tabular-nums text-ink">
          {value}
        </span>
        {href ? <ChevronRight size={14} className="text-ink-muted" /> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-paper md:px-6"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-5 py-4 md:px-6">
      {inner}
    </li>
  );
}
