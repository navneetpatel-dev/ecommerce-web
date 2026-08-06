'use client'

import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { FormError } from '@/shared/components/FormError'
import { useAccountProfile, useUpdateProfile } from '../../api/account.queries'

const PREF_ROWS = [
  {
    key: 'orderUpdates' as const,
    id: 'order-updates',
    label: 'Order updates',
    description: 'Confirmations, shipping, and delivery emails',
  },
  {
    key: 'smsAlerts' as const,
    id: 'sms-alerts',
    label: 'SMS alerts',
    description: 'Text messages for high-priority order events',
  },
  {
    key: 'shippingNotifications' as const,
    id: 'shipping-push',
    label: 'Shipping notifications',
    description: 'Alerts when packages move',
  },
]

export function NotificationsSection() {
  const { data: profile, isLoading, isError, error } = useAccountProfile()
  const updateProfile = useUpdateProfile()

  if (isLoading) {
    return (
      <div className="space-y-4 border border-line bg-surface p-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="border border-line bg-surface px-5 py-10 text-center">
        <p className="text-[0.9375rem] text-ink-muted">
          {(error as Error | null)?.message || 'Could not load preferences. Please try again.'}
        </p>
      </div>
    )
  }

  const marketingOn = Boolean(profile.emailMarketingConsent)
  const prefs = profile.notificationPrefs ?? {
    orderUpdates: true,
    smsAlerts: false,
    shippingNotifications: true,
  }

  return (
    <div className="space-y-4 border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line px-5 py-4 md:px-6">
        <h2 className="hidden font-display text-[1.125rem] text-ink lg:block">Notifications</h2>
        <p className="text-[0.875rem] text-ink-muted lg:mt-1">
          Choose which messages you want from us.
        </p>
      </div>

      <div className="divide-y divide-line">
        <div className="flex items-start justify-between gap-4 px-5 py-4 md:px-6">
          <div className="min-w-0">
            <Label htmlFor="email-marketing" className="text-[0.9375rem] font-medium text-ink">
              Promotions & newsletter
            </Label>
            <p className="mt-1 text-[0.8125rem] text-ink-muted">
              Occasional offers, new arrivals, and editorial picks by email.
            </p>
          </div>
          <Switch
            id="email-marketing"
            checked={marketingOn}
            disabled={updateProfile.isPending}
            onCheckedChange={(checked) =>
              updateProfile.mutate({ emailMarketingConsent: checked })
            }
          />
        </div>

        {PREF_ROWS.map((pref) => (
          <div
            key={pref.id}
            className="flex items-start justify-between gap-4 px-5 py-4 md:px-6"
          >
            <div className="min-w-0">
              <Label htmlFor={pref.id} className="text-[0.9375rem] font-medium text-ink">
                {pref.label}
              </Label>
              <p className="mt-1 text-[0.8125rem] text-ink-muted">{pref.description}</p>
            </div>
            <Switch
              id={pref.id}
              checked={Boolean(prefs[pref.key])}
              disabled={updateProfile.isPending}
              onCheckedChange={(checked) =>
                updateProfile.mutate({
                  notificationPrefs: { [pref.key]: checked },
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="px-5 pb-5 md:px-6">
        <FormError
          error={updateProfile.error as Error | null}
          fallback="Could not update notification preference."
        />
      </div>
    </div>
  )
}
