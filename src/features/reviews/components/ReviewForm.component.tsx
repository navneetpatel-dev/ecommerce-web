import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormError } from "@/shared/components/FormError.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Star } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ReviewFormInput } from "../schemas/reviews.schema";

interface ReviewFormProps {
  productName: string;
  register: UseFormRegister<ReviewFormInput>;
  errors: FieldErrors<ReviewFormInput>;
  rating: number;
  body: string;
  hoverRating: number;
  isPending: boolean;
  formLevelError?: string | null;
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
  hoverRating,
  isPending,
  formLevelError = null,
  onSetHoverRating,
  onSetRating,
  onSubmit,
}: ReviewFormProps) {
  const canSubmit = rating >= 1 && body.trim().length >= 10;
  const disableHint =
    rating < 1 ? LABELS.selectReviewRating : LABELS.enterReviewBody;

  return (
    <form onSubmit={onSubmit} className="max-w-lg">
      <FormStack>
        <p className="text-body text-ink-muted">
          {formatLabel(LABELS.reviewingProduct, { name: productName })}
        </p>

        <FormSection
          title={LABELS.reviewFormSection}
          hint={LABELS.reviewFormSectionHint}
          columns={1}
        >
          <FormFieldFrame label={LABELS.rating} error={errors.rating?.message}>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Button
                  key={i}
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onSetRating(i)}
                  onMouseEnter={() => onSetHoverRating(i)}
                  onMouseLeave={() => onSetHoverRating(0)}
                  className="h-auto min-h-0 max-h-none w-auto px-0"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i <= (hoverRating || rating)
                        ? "fill-warning text-warning"
                        : "text-line"
                    }`}
                  />
                </Button>
              ))}
            </div>
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.reviewTitleOptional} htmlFor="title">
            <Input
              id="title"
              {...register("title")}
              placeholder={LABELS.reviewTitlePlaceholder}
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
              rows={4}
            />
          </FormFieldFrame>
        </FormSection>

        <FormError
          error={formLevelError}
          fallback={LABELS.couldNotSubmitReview}
        />

        <FormActions>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              loading={isPending}
              disabled={!canSubmit || isPending}
            >
              {LABELS.submitReview}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
