import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'

export const metadata = generateNoIndexMetadata('Forgot Password')

export default function ForgotPassword() {
  return <ForgotPasswordPage />
}
