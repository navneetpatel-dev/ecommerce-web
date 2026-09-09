"use client";

import { useState } from "react";
import {
  useDeliveryRating,
  useSubmitDeliveryRating,
} from "../../api/tracking/shipping.queries";

export function useDeliveryRatingPrompt(shipmentId: string) {
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");

  const existing = useDeliveryRating(shipmentId);
  const submit = useSubmitDeliveryRating(shipmentId);

  const shouldRender = !dismissed && !existing.isLoading && !existing.data;
  const showCommentForm = selected > 0;

  const submitRating = () => {
    submit.mutate({
      rating: selected,
      comment: comment.trim() || undefined,
    });
  };

  return {
    shouldRender,
    selected,
    setSelected,
    comment,
    setComment,
    showCommentForm,
    isSubmitting: submit.isPending,
    dismiss: () => setDismissed(true),
    submitRating,
  };
}
