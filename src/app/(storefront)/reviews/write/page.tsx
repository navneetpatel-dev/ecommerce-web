import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AwaitingReviewsPage } from "@/features/reviews";
import { AuthGate } from "@/shared/components/system/AuthGate.component";

export const metadata = generateNoIndexMetadata("Write a review");

export default function WriteReviewRoute() {
  return (
    <AuthGate>
      <AwaitingReviewsPage />
    </AuthGate>
  );
}
