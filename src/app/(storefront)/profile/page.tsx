import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { ProfilePage } from '@/features/auth/pages/ProfilePage'

export const metadata = generateNoIndexMetadata('Profile')

export default function Profile() {
  return <ProfilePage />
}
