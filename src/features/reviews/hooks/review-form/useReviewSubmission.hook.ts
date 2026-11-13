import { useMemo, useState } from "react";
import type { UploadedMediaAttachment } from "@/features/supportTickets";
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
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";

export function useReviewSubmission(
  orderItemId: string,
  productId: string,
  onSubmitted?: () => void,
) {
  const submitReview = useSubmitReview({ onSubmitted });
  const { requireAuth } = useRequireAuth();
  const [hoverRating, setHoverRating] = useState(0);
  // The id the review will take: its photos/video upload under it before posting.
  const draftId = useMemo(() => crypto.randomUUID(), []);
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([]);

  const form = useForm<ReviewFormInput>({
    mode: "onTouched",
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { rating: 0 },
  });

  useUnsavedChanges(form.formState.isDirty || attachments.length > 0);

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

  // react-hook-form's watch() is compiler-incompatible by design; the
  // value is used directly in render, so no memoization is needed.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rating = watch("rating") || 0;
  const body = watch("body") || "";
  const title = watch("title") || "";
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
      draftId,
      attachments: attachments.map(({ url, type, durationSeconds }) => ({
        url,
        type,
        durationSeconds,
      })),
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    title,
    formLevelError,
    rating,
    body,
    hoverRating,
    setHoverRating,
    setRating,
    onSubmit,
    draftId,
    attachments,
    setAttachments,
    isPending: submitReview.isPending,
  };
}
