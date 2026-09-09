"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";
import { useDeliveryRatingPrompt } from "../../hooks/actions/useDeliveryRatingPrompt.hook";
import { DeliveryRatingStars } from "./DeliveryRatingStars.component";

/** Optional, dismissible "rate your delivery" prompt — never blocks anything. */
export function DeliveryRatingPrompt({ shipmentId }: { shipmentId: string }) {
  const {
    shouldRender,
    selected,
    setSelected,
    comment,
    setComment,
    showCommentForm,
    isSubmitting,
    dismiss,
    submitRating,
  } = useDeliveryRatingPrompt(shipmentId);

  if (!shouldRender) return null;

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
          onClick={dismiss}
        >
          <X
            className={ordersComponentsStyles.promptDismissIcon}
            aria-hidden="true"
          />
        </button>
      </div>
      <DeliveryRatingStars selected={selected} onSelect={setSelected} />
      {showCommentForm ? (
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
            loading={isSubmitting}
            onClick={submitRating}
          >
            Submit rating
          </Button>
        </>
      ) : null}
    </div>
  );
}
