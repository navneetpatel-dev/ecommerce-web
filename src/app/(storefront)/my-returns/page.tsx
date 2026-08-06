import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { MyReturnsPage } from '@/features/returns/pages/MyReturnsPage'

export const metadata = generateNoIndexMetadata('Returns')

export default function MyReturnsRoute() {
  return <MyReturnsPage />
}
