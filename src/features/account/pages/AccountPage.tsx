'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { UserRound } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AccountLayout } from '../components/AccountLayout'
import { OverviewSection } from '../components/sections/OverviewSection'
import { PersonalInfoSection } from '../components/sections/PersonalInfoSection'
import { SecuritySection } from '../components/sections/SecuritySection'
import { AddressesSection } from '../components/sections/AddressesSection'
import { PaymentsSection } from '../components/sections/PaymentsSection'
import { OrdersWalletSection } from '../components/sections/OrdersWalletSection'
import { NotificationsSection } from '../components/sections/NotificationsSection'
import { PrivacySection } from '../components/sections/PrivacySection'
import { useAccountPage } from '../hooks/useAccountPage'
import type { AccountSectionId } from '../types'

function AccountSectionBody({
  section,
  onNavigate,
}: {
  section: AccountSectionId
  onNavigate: (id: AccountSectionId) => void
}) {
  switch (section) {
    case 'overview':
      return <OverviewSection onNavigate={onNavigate} />
    case 'personal':
      return <PersonalInfoSection />
    case 'security':
      return <SecuritySection />
    case 'addresses':
      return <AddressesSection />
    case 'payments':
      return <PaymentsSection />
    case 'orders':
      return <OrdersWalletSection />
    case 'notifications':
      return <NotificationsSection />
    case 'privacy':
      return <PrivacySection />
    default:
      return <OverviewSection onNavigate={onNavigate} />
  }
}

function AccountPageInner() {
  const { isAuthenticated, sections, activeSection, setSection } = useAccountPage()

  if (!isAuthenticated) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
        />
        <div className="storefront-container relative py-16 md:py-20">
          <EmptyState
            icon={UserRound}
            heading="Sign in to manage your account"
            message="Access profile settings, addresses, orders, and preferences after you log in."
            actionLabel="Sign in"
            actionTo="/login?redirect=/profile"
          />
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" asChild>
              <Link href="/register">Create an account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AccountLayout
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setSection}
    >
      <AccountSectionBody section={activeSection} onNavigate={setSection} />
    </AccountLayout>
  )
}

function AccountPageFallback() {
  return (
    <div className="storefront-container space-y-4 py-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  )
}

export function AccountPage() {
  return (
    <Suspense fallback={<AccountPageFallback />}>
      <AccountPageInner />
    </Suspense>
  )
}
