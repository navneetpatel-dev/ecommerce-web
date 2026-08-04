import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { RegisterForm } from '@/features/auth/pages/RegisterForm'

export const metadata = generateNoIndexMetadata('Register')

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <RegisterForm />
    </div>
  )
}
