import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { isUgcTextValid } from "@/shared/schemas/ugcText.schema";
import { CharacterCount } from "@/shared/components/forms/CharacterCount.component";
import { UPLOAD_ENTITY } from "@/shared/constants/uploads/uploads";
import {
  TicketAttachmentUploader,
  type UploadedMediaAttachment,
} from "@/features/supportTickets";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ReviewFormInput } from "../../schemas/review-form/reviews.schema";
import { ReviewRatingStars } from "./ReviewRatingStars.component";
import { reviewFormStyles as styles } from "../../styles/review-form/reviewForm.styles";

interface ReviewFormProps {
  productName: string;
  register: UseFormRegister<ReviewFormInput>;
  errors: FieldErrors<ReviewFormInput>;
  rating: number;
  body: string;
  title: string;
  hoverRating: number;
  /** Photos/video upload (new reviews only; an edit keeps the posted media). */
  showMedia?: boolean;
  /** Shown beside Submit (edit mode: "Delete review"). */
  extraAction?: React.ReactNode;
  submitLabel?: string;
  isPending: boolean;
  formLevelError?: string | null;
  /** Upload id for this review's photos/video (the id the review takes). */
  draftId: string;
  attachments: UploadedMediaAttachment[];
  onAttachmentsChange: (next: UploadedMediaAttachment[]) => void;
  onSetHoverRating: (value: number) => void;
  onSetRating: (value: number) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function ReviewForm({
  productName,
  register,
  errors,
  rating,
  body,
  title,
  hoverRating,
  showMedia = true,
  extraAction = null,
  submitLabel = LABELS.submitReview,
  isPending,
  formLevelError = null,
  draftId,
  attachments,
  onAttachmentsChange,
  onSetHoverRating,
  onSetRating,
  onSubmit,
}: ReviewFormProps) {
  const handleRemoveAllMedia = () => onAttachmentsChange([]);
  const canSubmit = rating >= 1 && isUgcTextValid(body, UGC_LIMITS.reviewBody);
  const disableHint =
    rating < 1 ? LABELS.selectReviewRating : LABELS.enterReviewBody;

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {productName ? (
        <p className={styles.reviewingText}>
          {formatLabel(LABELS.reviewingProduct, { name: productName })}
        </p>
      ) : null}

      {/* One flat form: stacks in a dialog, splits into text | photos when wide. */}
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <FormFieldFrame label={LABELS.rating} error={errors.rating?.message}>
            <ReviewRatingStars
              rating={rating}
              hoverRating={hoverRating}
              onSetRating={onSetRating}
              onSetHoverRating={onSetHoverRating}
            />
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.reviewTitleOptional} htmlFor="title">
            <Input
              id="title"
              {...register("title")}
              placeholder={LABELS.reviewTitlePlaceholder}
              maxLength={UGC_LIMITS.reviewTitle.max}
              aria-describedby="review-title-count"
            />
            <CharacterCount
              id="review-title-count"
              value={title}
              limits={UGC_LIMITS.reviewTitle}
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.reviewBody}
            htmlFor="body"
            error={errors.body?.message}
          >
            <Textarea
              id="body"
              error={Boolean(errors.body?.message)}
              {...register("body")}
              placeholder={LABELS.reviewBodyPlaceholder}
              rows={5}
              maxLength={UGC_LIMITS.reviewBody.max}
              aria-describedby="review-body-count"
            />
            <CharacterCount
              id="review-body-count"
              value={body}
              limits={UGC_LIMITS.reviewBody}
            />
          </FormFieldFrame>
        </div>

        {showMedia ? (
          <div className={styles.mediaColumn}>
            <TicketAttachmentUploader
              entityType={UPLOAD_ENTITY.REVIEWS}
              entityId={draftId}
              value={attachments}
              onChange={onAttachmentsChange}
              disabled={isPending}
              label={LABELS.reviewMediaLabel}
            />
            {attachments.length > 1 ? (
              <button
                type="button"
                className={styles.removeAllMedia}
                disabled={isPending}
                onClick={handleRemoveAllMedia}
              >
                {LABELS.removeAllMedia}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <FormError
        error={formLevelError}
        fallback={LABELS.couldNotSubmitReview}
      />

      <div className={styles.actions}>
        {extraAction}
        <DisabledActionHint disabled={!canSubmit} message={disableHint}>
          <Button
            type="submit"
            loading={isPending}
            disabled={!canSubmit || isPending}
            className={styles.submit}
          >
            {submitLabel}
          </Button>
        </DisabledActionHint>
      </div>
    </form>
  );
}
