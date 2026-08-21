"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { cn } from "@/shared/utils/cn";
import { Star } from "lucide-react";

interface TicketRatingSectionProps {
  rating: string;
  onRatingChange: (rating: string) => void;
  ratePending: boolean;
  onSubmit: () => Promise<void>;
}

/** Star-rating widget shown to customers when a ticket can be rated. */
export function TicketRatingSection(props: TicketRatingSectionProps) {
  const ratingErrorSubmit = async () => {
    try {
      await props.onSubmit();
    } catch {
      /* error surfaced by parent via ratingError state */
    }
  };

  return (
    <section className="border border-line bg-surface p-3 shadow-elevation-1 sm:p-4">
      <TextEyebrow>{LABELS.ticketRate}</TextEyebrow>
      <p className="mt-1 text-[0.75rem] text-ink-muted">
        {LABELS.ticketRateHint}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div
          className="flex gap-0.5"
          role="radiogroup"
          aria-label={LABELS.ticketRate}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={Number(props.rating) >= n}
              className="rounded-sm p-0.5 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              onClick={() => props.onRatingChange(String(n))}
            >
              <Star
                size={22}
                className={cn(
                  "transition-colors",
                  Number(props.rating) >= n
                    ? "fill-brand text-brand"
                    : "fill-transparent text-ink-muted/50",
                )}
              />
            </button>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          loading={props.ratePending}
          onClick={() => void ratingErrorSubmit()}
        >
          {LABELS.ticketRateSubmit}
        </Button>
      </div>
    </section>
  );
}

export function TicketRatedBanner({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2 border border-brand/25 bg-brand-subtle/50 px-3 py-2">
      <span className="text-[0.8125rem] text-ink">
        {LABELS.ticketRatedThanks}
      </span>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={14}
            className={cn(
              n <= rating
                ? "fill-brand text-brand"
                : "fill-transparent text-ink-muted/40",
            )}
          />
        ))}
      </span>
    </div>
  );
}

export function TicketRatingError({ message }: { message: string }) {
  return (
    <FormError
      error={new Error(message)}
      fallback={LABELS.ticketCouldNotRate}
    />
  );
}

export function buildRatingErrorMessage(err: unknown): string {
  return getApiErrorMessage(err, LABELS.ticketCouldNotRate);
}
