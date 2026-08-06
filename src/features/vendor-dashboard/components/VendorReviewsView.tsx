import { Button } from '@/shared/components/ui/button'
import type { Review } from '@/shared/api/types'

interface VendorReviewsViewProps {
  reviews: Review[]
  onRespond: (reviewId: string, response: string) => void
}

export function VendorReviewsView({ reviews, onRespond }: VendorReviewsViewProps) {
  return (
    <section className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-ink">Reviews</h1>
      {reviews.map((review) => (
        <article key={review.id} className="border border-line p-4">
          <p className="font-medium text-ink">
            {review.title ?? 'Review'} · {review.rating}/5
          </p>
          <p className="mt-2 text-ink-muted">{review.body}</p>
          <Button
            className="mt-3"
            size="sm"
            variant="secondary"
            onClick={() => {
              const response = window.prompt('Response')
              if (response) onRespond(review.id, response)
            }}
          >
            Respond
          </Button>
        </article>
      ))}
      {!reviews.length && <p className="text-ink-muted">No reviews found.</p>}
    </section>
  )
}
