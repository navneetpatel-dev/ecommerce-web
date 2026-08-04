import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { WishlistPage } from '@/features/wishlist/pages/WishlistPage'

export const metadata = generateNoIndexMetadata('Wishlist')

export default function Wishlist() {
  return <WishlistPage />
}
