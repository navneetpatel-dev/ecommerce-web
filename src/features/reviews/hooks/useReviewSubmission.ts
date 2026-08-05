import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReviewFormSchema, type ReviewFormInput } from '../schemas/reviews.schema'
import { useSubmitReview } from '../api/reviews.queries'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'

export function useReviewSubmission(orderItemId: string, productId: string) {
  const submitReview = useSubmitReview()
  const { requireAuth } = useRequireAuth()
  const [hoverRating, setHoverRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormInput>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { rating: 0 },
  })

  const rating = watch('rating') || 0
  const setRating = (next: number) => setValue('rating', next, { shouldValidate: true })

  const onSubmit = (data: ReviewFormInput) => {
    if (
      !requireAuth({
        title: 'Write a review',
        message: 'Sign in to share your experience with this product.',
      })
    ) {
      return
    }
    submitReview.mutate({
      orderItemId,
      productId,
      rating: data.rating,
      title: data.title,
      body: data.body,
    })
  }

  return {
    register,
    handleSubmit,
    errors,
    rating,
    hoverRating,
    setHoverRating,
    setRating,
    onSubmit,
    isPending: submitReview.isPending,
  }
}
