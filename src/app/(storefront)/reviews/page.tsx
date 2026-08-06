import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { MyReviewsPage } from '@/features/reviews/pages/MyReviewsPage'

export const metadata = generateNoIndexMetadata('Your reviews')

export default function ReviewsRoute() {
  return <MyReviewsPage />
}
