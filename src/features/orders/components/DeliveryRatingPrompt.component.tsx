"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Star, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { shippingApi } from "../api/shipping.api";
import { ordersComponentsStyles } from "./ordersComponents.styles";

/** Optional, dismissible "rate your delivery" prompt — never blocks anything. */
export function DeliveryRatingPrompt({ shipmentId }: { shipmentId: string }) {
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");

  const existing = useQuery({
    queryKey: ["delivery-rating", shipmentId],
    queryFn: () => shippingApi.getRating(shipmentId),
  });

  const submit = useMutation({
    mutationFn: () =>
      shippingApi.submitRating(
        shipmentId,
        selected,
        comment.trim() || undefined,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["delivery-rating", shipmentId],
      });
    },
  });

  if (dismissed || existing.isLoading || existing.data) return null;

  return (
    <div className={ordersComponentsStyles.promptRoot}>
      <div className={ordersComponentsStyles.promptHeader}>
        <p className={ordersComponentsStyles.promptTitle}>
          How was your delivery?
        </p>
        <button
          type="button"
          aria-label="Dismiss"
          className={ordersComponentsStyles.promptDismissButton}
          onClick={() => setDismissed(true)}
        >
          <X
            className={ordersComponentsStyles.promptDismissIcon}
            aria-hidden="true"
          />
        </button>
      </div>
      <div className={ordersComponentsStyles.promptStarsRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            onClick={() => setSelected(value)}
          >
            <Star
              className={
                value <= selected
                  ? ordersComponentsStyles.starSelected
                  : ordersComponentsStyles.starUnselected
              }
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {selected > 0 ? (
        <>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)"
            rows={2}
            maxLength={500}
          />
          <Button
            size="sm"
            className={ordersComponentsStyles.promptSubmitButton}
            loading={submit.isPending}
            onClick={() => submit.mutate()}
          >
            Submit rating
          </Button>
        </>
      ) : null}
    </div>
  );
}
