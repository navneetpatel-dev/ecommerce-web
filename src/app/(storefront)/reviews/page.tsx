import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyReviewsPage } from "@/features/reviews";

export const metadata = generateNoIndexMetadata("Your reviews");

export default function ReviewsRoute() {
  return <MyReviewsPage />;
}
