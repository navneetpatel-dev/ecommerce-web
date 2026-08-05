import { Suspense } from 'react'
import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { LoginForm } from '@/features/auth/pages/LoginForm'

export const metadata = generateNoIndexMetadata('Login')

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
