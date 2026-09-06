import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { GiftCardPurchasePage } from "@/features/giftCards";

export const metadata = generateNoIndexMetadata("Buy a gift card");

export default function GiftCardsRoute() {
  return <GiftCardPurchasePage />;
}
