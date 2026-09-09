import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

export function GlanceRow({
  icon: Icon,
  label,
  value,
  href,
  onDetails,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  href?: string;
  onDetails?: () => void;
}) {
  const action = onDetails ? (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={onDetails}
      className="h-auto min-h-0 max-h-none gap-1 px-0 py-0 text-body-sm font-medium text-brand hover:text-brand-hover"
    >
      {LABELS.details}
      <ChevronRight size={14} />
    </Button>
  ) : href ? (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:text-brand-hover"
    >
      {LABELS.view}
      <ChevronRight size={14} />
    </Link>
  ) : null;

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          size={16}
          strokeWidth={1.5}
          className="shrink-0 text-ink-muted"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-body text-ink">{label}</p>
          <p className="mt-0.5 font-display text-[1.25rem] tabular-nums text-ink">
            {value}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">{action}</div>
    </li>
  );
}
