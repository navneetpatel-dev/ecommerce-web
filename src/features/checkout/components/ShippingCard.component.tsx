import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { ShippingRate } from "@/shared/api/types";

interface ShippingCardProps {
  vendor: {
    id: string;
    businessName: string;
    slug: string;
    logoUrl: string | null;
  };
  options: ShippingRate[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  selected?: string;
  onSelect: (method: ShippingMethod) => void;
}

function formatDays(days: number) {
  if (days <= 1) return "1 business day";
  return `${days} business days`;
}

export function ShippingCard({
  vendor,
  options,
  isLoading,
  isError,
  errorMessage,
  selected,
  onSelect,
}: ShippingCardProps) {
  return (
    <section className="border border-line bg-surface-raised p-4 shadow-elevation-1 md:p-5">
      <VendorStrip vendor={vendor} />

      {isLoading && (
        <p className="mt-4 text-[0.875rem] text-ink-muted">
          Loading shipping rates…
        </p>
      )}
      {isError && errorMessage ? (
        <p className="mt-4 text-[0.875rem] text-red-600">{errorMessage}</p>
      ) : null}
      {!isLoading && !isError && options.length === 0 && (
        <p className="mt-4 text-[0.875rem] text-ink-muted">
          No shipping rates are configured for this delivery area yet.
        </p>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option.method;
          const label =
            option.method === SHIPPING_METHOD.EXPRESS ? "Express" : "Standard";
          return (
            <Button
              key={option.method}
              type="button"
              variant="outline"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.method)}
              className={cn(
                "h-auto min-h-11 max-h-none px-4 py-3.5 text-left font-normal",
                isSelected
                  ? "border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-brand-subtle hover:text-ink"
                  : "border-line hover:border-ink/25",
              )}
            >
              <div className="flex w-full items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{label}</span>
                <span className="font-mono text-[0.875rem] tabular-nums text-ink">
                  {option.shippingDisplayKey === "FREE"
                    ? "Free"
                    : `₹${Number(option.cost)}`}
                </span>
              </div>
              <p className="mt-1 text-body-sm text-ink-muted">
                {formatDays(Number(option.estimatedDays || 5))}
              </p>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
