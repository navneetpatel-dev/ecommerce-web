import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'

export const metadata = generateNoIndexMetadata('Forgot Password')

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <ForgotPasswordPage />
    </div>
  )
}
