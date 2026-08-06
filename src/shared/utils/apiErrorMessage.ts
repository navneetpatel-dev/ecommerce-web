import { ApiError } from '@/shared/api/client'

/** Prefer a string `details` payload when present (legacy ValidationError shape). */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (typeof err.details === 'string' && err.details.trim()) return err.details
    if (err.message?.trim()) return err.message
  }
  if (err instanceof Error && err.message.trim()) return err.message
  return fallback
}
