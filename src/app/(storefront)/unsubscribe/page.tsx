import { Suspense } from "react";
import { UnsubscribePage } from "@/features/content";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.unsubscribeHeading);

export default function Unsubscribe() {
  return (
    <Suspense fallback={null}>
      <UnsubscribePage />
    </Suspense>
  );
}
