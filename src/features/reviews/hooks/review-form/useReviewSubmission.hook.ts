import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import {
  ReviewFormSchema,
  type ReviewFormInput,
} from "../../schemas/review-form/reviews.schema";
import { useSubmitReview } from "../../api/reviews/reviews.queries";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";

export function useReviewSubmission(orderItemId: string, productId: string) {
  const submitReview = useSubmitReview();
  const { requireAuth } = useRequireAuth();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormInput>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { rating: 0 },
  });

  const { formLevelError } = useApiFormErrors(
    form,
    submitReview.error,
    LABELS.couldNotSubmitReview,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const rating = watch("rating") || 0;
  const body = watch("body") || "";
  const setRating = (next: number) =>
    setValue("rating", next, { shouldValidate: true });

  const onSubmit = (data: ReviewFormInput) => {
    if (
      !requireAuth({
        title: "Write a review",
        message: "Sign in to share your experience with this product.",
      })
    ) {
      return;
    }
    submitReview.mutate({
      orderItemId,
      productId,
      rating: data.rating,
      title: data.title,
      body: data.body,
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    formLevelError,
    rating,
    body,
    hoverRating,
    setHoverRating,
    setRating,
    onSubmit,
    isPending: submitReview.isPending,
  };
}
