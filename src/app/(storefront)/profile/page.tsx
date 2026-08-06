import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { AccountPage } from '@/features/account'

export const metadata = generateNoIndexMetadata('Account settings')

export default function Profile() {
  return <AccountPage />
}
