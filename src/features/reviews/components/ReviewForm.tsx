import { Button } from '@/shared/components/ui/button'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { Star } from 'lucide-react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ReviewFormInput } from '../schemas/reviews.schema'

interface ReviewFormProps {
  productName: string
  register: UseFormRegister<ReviewFormInput>
  errors: FieldErrors<ReviewFormInput>
  rating: number
  hoverRating: number
  isPending: boolean
  onSetHoverRating: (value: number) => void
  onSetRating: (value: number) => void
  onSubmit: (event: React.FormEvent) => void
}

export function ReviewForm({
  productName,
  register,
  errors,
  rating,
  hoverRating,
  isPending,
  onSetHoverRating,
  onSetRating,
  onSubmit,
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-lg">
      <FormStack>
        <p className="text-[0.9375rem] text-ink-muted">
          {formatLabel(LABELS.reviewingProduct, { name: productName })}
        </p>

        <FormSection title={LABELS.reviewFormSection} hint={LABELS.reviewFormSectionHint} columns={1}>
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
                      i <= (hoverRating || rating) ? 'fill-warning text-warning' : 'text-line'
                    }`}
                  />
                </Button>
              ))}
            </div>
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.reviewTitleOptional} htmlFor="title">
            <Input
              id="title"
              {...register('title')}
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
              {...register('body')}
              placeholder={LABELS.reviewBodyPlaceholder}
              rows={4}
            />
          </FormFieldFrame>
        </FormSection>

        <FormActions>
          <Button type="submit" loading={isPending}>
            {LABELS.submitReview}
          </Button>
        </FormActions>
      </FormStack>
    </form>
  )
}
