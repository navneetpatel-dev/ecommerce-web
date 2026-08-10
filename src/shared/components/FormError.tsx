import { sanitizeUserFacingMessage } from '@/shared/utils/apiErrorMessage'

interface FormErrorProps {
  error: Error | null
  fallback: string
}

export function FormError({ error, fallback }: FormErrorProps) {
  if (!error) return null
  return (
    <p role="alert" className="text-[0.8125rem] text-danger">
      {sanitizeUserFacingMessage(error.message, fallback) || fallback}
    </p>
  )
}
