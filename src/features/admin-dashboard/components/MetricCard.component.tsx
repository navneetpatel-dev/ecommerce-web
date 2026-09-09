import { cn } from "@/shared/utils/cn";

interface MetricCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-paper/50 p-4 transition-all duration-200 hover:border-line-strong hover:bg-paper/70",
        highlight && "border-brand/30 bg-brand/[0.04]",
      )}
    >
      <p className="text-body-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-xl font-bold tabular-nums tracking-tight text-ink",
          highlight && "text-brand",
        )}
      >
        {value}
      </p>
    </div>
  );
}
