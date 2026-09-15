import { cn } from "@/shared/utils/dom/cn";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  indeterminate?: boolean;
}

export function Progress({
  value,
  className,
  indeterminate = false,
}: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-line",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-brand transition-[width] duration-300",
          indeterminate && "animate-pulse",
        )}
        style={{
          width: `${indeterminate ? 100 : Math.max(2, Math.min(100, value))}%`,
        }}
      />
    </div>
  );
}
