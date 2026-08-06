import type { Metadata } from 'next'
import { HelpPage } from '@/features/help/pages/HelpPage'

export const metadata: Metadata = {
  title: 'Help Centre',
  description:
    'Guides for orders, shipping, returns, payments, and your account on our marketplace.',
}

export default function HelpRoute() {
  return <HelpPage />
}
