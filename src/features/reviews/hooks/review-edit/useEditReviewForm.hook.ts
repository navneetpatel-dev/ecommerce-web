"use client";

import { useState } from "react";
import type { UploadedMediaAttachment } from "@/features/supportTickets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import type { Review } from "@/shared/api/types";
import {
  ReviewFormSchema,
  type ReviewFormInput,
} from "../../schemas/review-form/reviews.schema";
import { useUpdateReview } from "../../api/reviews/reviews.queries";

/** The review form pre-filled with the shopper's review; saves stars + text. */
export function useEditReviewForm(review: Review, onSaved: () => void) {
  const updateReview = useUpdateReview();
  const [hoverRating, setHoverRating] = useState(0);
  // The review's photos/video, editable like a new review's (add, remove, remove all).
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>(
    () =>
      (review.media ?? []).map((item) => ({
        url: item.url,
        type: item.type,
        durationSeconds: item.durationSeconds ?? null,
        displayUrl: item.url,
      })),
  );
  const form = useForm<ReviewFormInput>({
    mode: "onTouched",
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      rating: review.rating,
      title: review.title ?? "",
      body: review.body,
    },
  });
  const { formLevelError } = useApiFormErrors(
    form,
    updateReview.error,
    LABELS.couldNotSaveEdit,
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const rating = form.watch("rating") || 0;
  const body = form.watch("body") || "";
  const title = form.watch("title") || "";

  const onSubmit = (data: ReviewFormInput) => {
    form.clearErrors();
    updateReview.mutate(
      {
        reviewId: review.id,
        rating: data.rating,
        title: data.title || undefined,
        body: data.body,
        attachments: attachments.map(({ url, type, durationSeconds }) => ({
          url,
          type,
          durationSeconds,
        })),
      },
      { onSuccess: onSaved },
    );
  };

  return {
    register: form.register,
    errors: form.formState.errors,
    handleSubmit: form.handleSubmit(onSubmit),
    rating,
    body,
    title,
    hoverRating,
    setHoverRating,
    setRating: (next: number) =>
      form.setValue("rating", next, {
        shouldValidate: true,
        shouldDirty: true,
      }),
    attachments,
    setAttachments,
    formLevelError,
    isPending: updateReview.isPending,
  };
}
