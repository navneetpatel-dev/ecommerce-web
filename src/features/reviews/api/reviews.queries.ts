import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { reviewsApi } from './reviews.api'

export function useSubmitReview() {
  const router = useRouter()
  return useMutation({
    mutationFn: (input: { orderItemId: string; productId: string; rating: number; title?: string; body: string }) =>
      reviewsApi.submit(input),
    onSuccess: () => {
      router.push('/orders')
    },
  })
}

export function useVoteReview() {
  return useMutation({
    mutationFn: (input: { reviewId: string; vote: 'HELPFUL' | 'UNHELPFUL' }) =>
      reviewsApi.vote(input.reviewId, input.vote),
  })
}
