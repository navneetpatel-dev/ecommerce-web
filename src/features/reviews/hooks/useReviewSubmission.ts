import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReviewFormSchema, type ReviewFormInput } from '../schemas/reviews.schema'
import { useSubmitReview } from '../api/reviews.queries'

export function useReviewSubmission(orderItemId: string, productId: string) {
  const submitReview = useSubmitReview()
  const [hoverRating, setHoverRating] = useState(0)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReviewFormInput>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { rating: 0 },
  })

  const setRating = (rating: number) => setValue('rating', rating)

  const onSubmit = (data: ReviewFormInput) => {
    submitReview.mutate({ orderItemId, productId, rating: data.rating, title: data.title, body: data.body })
  }

  return { register, handleSubmit, errors, hoverRating, setHoverRating, setRating, onSubmit, isPending: submitReview.isPending }
}
