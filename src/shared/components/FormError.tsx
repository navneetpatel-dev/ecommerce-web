interface FormErrorProps {
  error: Error | null
  fallback: string
}

export function FormError({ error, fallback }: FormErrorProps) {
  if (!error) return null
  return <p className="text-sm text-danger">{error.message || fallback}</p>
}
