import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { WishlistPage } from "@/features/wishlist";

export const metadata = generateNoIndexMetadata("Wishlist");

export default function Wishlist() {
  return <WishlistPage />;
}
