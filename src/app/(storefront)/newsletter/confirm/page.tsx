import { Suspense } from "react";
import { NewsletterConfirmPage } from "@/features/content";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(
  LABELS.newsletterConfirmHeading,
);

export default function NewsletterConfirm() {
  return (
    <Suspense fallback={null}>
      <NewsletterConfirmPage />
    </Suspense>
  );
}
