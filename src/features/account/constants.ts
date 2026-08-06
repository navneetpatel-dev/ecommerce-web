import {
  Bell,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Shield,
  User,
  UserRound,
} from 'lucide-react'
import type { AccountNavItem, AccountSectionId } from './types'

export const ACCOUNT_SECTIONS: AccountNavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Profile snapshot and quick links',
    icon: UserRound,
  },
  {
    id: 'personal',
    label: 'Personal info',
    description: 'Name, phone, and email',
    icon: User,
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Password and sessions',
    icon: Lock,
  },
  {
    id: 'addresses',
    label: 'Addresses',
    description: 'Delivery addresses',
    icon: MapPin,
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Saved payment methods',
    icon: CreditCard,
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'Orders, wishlist, returns',
    icon: Package,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Email and marketing prefs',
    icon: Bell,
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Data and account deletion',
    icon: Shield,
  },
]

export const DEFAULT_ACCOUNT_SECTION: AccountSectionId = 'overview'

export const ACCOUNT_SECTION_IDS = ACCOUNT_SECTIONS.map((s) => s.id)

export function isAccountSectionId(value: string | null | undefined): value is AccountSectionId {
  return Boolean(value && ACCOUNT_SECTION_IDS.includes(value as AccountSectionId))
}
