import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";

export function TaskCard({
  href,
  title,
  subtitle,
  status,
}: {
  href: string;
  title: string;
  subtitle?: string | null;
  status: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-20 items-center gap-3 rounded-md border border-line bg-surface p-4 shadow-card-hairline transition-colors hover:border-brand/40"
    >
      <MapPin className="size-5 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{title}</p>
        {subtitle ? (
          <p className="mt-1 truncate text-body-sm text-ink-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      <StatusBadge status={status} />
      <ChevronRight
        className="size-4 shrink-0 text-ink-muted"
        aria-hidden="true"
      />
    </Link>
  );
}
