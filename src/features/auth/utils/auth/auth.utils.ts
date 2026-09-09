import type { CurrentUser } from '@/shared/api/types'

export function formatUserName(user: CurrentUser | null): string {
  if (!user) return ''
  return user.name
}
