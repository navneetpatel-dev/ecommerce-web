import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyGiftCardsPage } from "@/features/giftCards";
import { AuthGate } from "@/shared/components/system/AuthGate.component";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.myGiftCards);

export default function MyGiftCardsRoute() {
  return (
    <AuthGate>
      <MyGiftCardsPage />
    </AuthGate>
  );
}
