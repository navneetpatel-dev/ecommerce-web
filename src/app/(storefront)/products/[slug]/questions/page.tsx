import { Suspense } from "react";
import { AllQuestionsPage } from "@/features/productQna";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = generateNoIndexMetadata("Questions & Answers");

export default function ProductQuestionsRoute() {
  return (
    <Suspense fallback={<ReviewListSkeleton count={4} />}>
      <AllQuestionsPage />
    </Suspense>
  );
}
