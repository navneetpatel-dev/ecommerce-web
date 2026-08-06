import type { CurrentUser } from '@/shared/api/types'
import type { LucideIcon } from 'lucide-react'

/** Profile payload from GET /api/users/me */
export type AccountProfile = CurrentUser & {
  emailMarketingConsent?: boolean
  createdAt?: string
  avatarUrl?: string | null
  pendingEmail?: string | null
  notificationPrefs?: {
    orderUpdates: boolean
    smsAlerts: boolean
    shippingNotifications: boolean
  }
  emailVerificationToken?: string
}

export type AccountSectionId =
  | 'overview'
  | 'personal'
  | 'security'
  | 'addresses'
  | 'payments'
  | 'orders'
  | 'notifications'
  | 'privacy'

export interface AccountNavItem {
  id: AccountSectionId
  label: string
  description: string
  icon: LucideIcon
}
