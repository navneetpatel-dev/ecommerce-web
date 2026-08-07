import { ApiError } from '@/shared/api/client'

function firstFieldError(details: unknown): string | null {
  if (!details || typeof details !== 'object') return null
  const fieldErrors = (details as { fieldErrors?: Record<string, string[] | undefined> }).fieldErrors
  if (!fieldErrors || typeof fieldErrors !== 'object') return null
  for (const messages of Object.values(fieldErrors)) {
    if (Array.isArray(messages) && typeof messages[0] === 'string' && messages[0].trim()) {
      return messages[0]
    }
  }
  const formErrors = (details as { formErrors?: string[] }).formErrors
  if (Array.isArray(formErrors) && typeof formErrors[0] === 'string' && formErrors[0].trim()) {
    return formErrors[0]
  }
  return null
}

/** Prefer useful API error text (message, string details, or first Zod field error). */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (typeof err.details === 'string' && err.details.trim()) return err.details
    const fieldMessage = firstFieldError(err.details)
    if (fieldMessage) return fieldMessage
    if (err.message?.trim() && err.message !== 'Validation failed') return err.message
    if (err.message?.trim()) return err.message
  }
  if (err instanceof Error && err.message.trim()) return err.message
  return fallback
}
