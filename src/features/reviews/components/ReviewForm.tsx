import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
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
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <p className="text-[0.9375rem] text-ink-muted">Reviewing: {productName}</p>
      <div>
        <Label>Rating</Label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSetRating(i)}
              onMouseEnter={() => onSetHoverRating(i)}
              onMouseLeave={() => onSetHoverRating(0)}
            >
              <Star
                className={`h-6 w-6 ${i <= (hoverRating || rating) ? 'fill-warning text-warning' : 'text-line'}`}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-[0.9375rem] text-danger">{errors.rating.message}</p>}
      </div>
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input id="title" {...register('title')} placeholder="Summarize your experience" />
      </div>
      <div>
        <Label htmlFor="body">Review</Label>
        <Textarea id="body" {...register('body')} placeholder="What did you think?" rows={4} />
        {errors.body && <p className="text-[0.9375rem] text-danger">{errors.body.message}</p>}
      </div>
      <Button type="submit" loading={isPending}>Submit review</Button>
    </form>
  )
}
