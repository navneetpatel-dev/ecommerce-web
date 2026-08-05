import { useReviewSubmission } from '../hooks/useReviewSubmission'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  orderItemId: string
  productId: string
  productName: string
}

export function ReviewForm({ orderItemId, productId, productName }: ReviewFormProps) {
  const { register, handleSubmit, errors, hoverRating, setHoverRating, setRating, onSubmit, isPending } =
    useReviewSubmission(orderItemId, productId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <p className="text-[0.9375rem] text-ink-muted">Reviewing: {productName}</p>
      <div>
        <Label>Rating</Label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-6 w-6 ${i <= (hoverRating || 0) ? 'fill-accent text-accent' : 'text-line'}`}
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
