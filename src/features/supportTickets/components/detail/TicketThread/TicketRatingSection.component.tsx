"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { cn } from "@/shared/utils/dom/cn";
import { Star } from "lucide-react";
import { ticketThreadStyles } from "./ticketThread.styles";

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
    <section className={ticketThreadStyles.ratingCard}>
      <TextEyebrow>{LABELS.ticketRate}</TextEyebrow>
      <p className={ticketThreadStyles.ratingHint}>{LABELS.ticketRateHint}</p>
      <div className={ticketThreadStyles.ratingRow}>
        <div
          className={ticketThreadStyles.ratingStars}
          role="radiogroup"
          aria-label={LABELS.ticketRate}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={Number(props.rating) >= n}
              className={ticketThreadStyles.starBtn}
              onClick={() => props.onRatingChange(String(n))}
            >
              <Star
                size={22}
                className={cn(
                  ticketThreadStyles.starTransition,
                  Number(props.rating) >= n
                    ? ticketThreadStyles.starActive
                    : ticketThreadStyles.starInactive,
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
    <div className={ticketThreadStyles.ratedBanner}>
      <span className={ticketThreadStyles.ratedText}>
        {LABELS.ticketRatedThanks}
      </span>
      <span className={ticketThreadStyles.ratingStars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={14}
            className={cn(
              n <= rating
                ? ticketThreadStyles.starActive
                : ticketThreadStyles.starBannerInactive,
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
