import { Suspense } from "react";
import { AllReviewsPage } from "@/features/reviews";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = generateNoIndexMetadata("Customer reviews");

export default function ProductReviewsRoute() {
  return (
    <Suspense fallback={<ReviewListSkeleton count={4} />}>
      <AllReviewsPage />
    </Suspense>
  );
}
