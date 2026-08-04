import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'

export const metadata = generateNoIndexMetadata('Reset Password')

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <ResetPasswordPage />
    </div>
  )
}
