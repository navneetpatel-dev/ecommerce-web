import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { reviewsApi } from './reviews.api'
import { navigate } from '@/shared/utils/navigate'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { PATHS } from '@/shared/constants/paths'

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: () => reviewsApi.forProduct(productId),
    enabled: Boolean(productId),
  })
}

export function useMyReviews() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.myReviews(),
    enabled: Boolean(accessToken),
  })
}

export function useSubmitReview() {
  const router = useRouter()
  return useMutation({
    mutationFn: (input: { orderItemId: string; productId: string; rating: number; title?: string; body: string }) =>
      reviewsApi.submit(input),
    onSuccess: () => {
      navigate(router, PATHS.orders)
    },
  })
}

export function useVoteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { reviewId: string; vote: 'HELPFUL' | 'UNHELPFUL' }) =>
      reviewsApi.vote(input.reviewId, input.vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
