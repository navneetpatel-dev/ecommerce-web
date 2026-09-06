import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { GiftCardRedeemPage } from "@/features/giftCards";

export const metadata = generateNoIndexMetadata("Redeem gift card");

export default function GiftCardRedeemRoute() {
  return <GiftCardRedeemPage />;
}
