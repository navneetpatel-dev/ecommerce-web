import { CartPage } from "@/features/cart";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.cart);

export default function Cart() {
  return <CartPage />;
}
