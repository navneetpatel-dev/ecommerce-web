'use client'

import { Monitor } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { FormError } from '@/shared/components/FormError'
import { ChangePasswordSection } from '@/features/auth/components/ChangePasswordSection'
import { useProfilePage } from '@/features/auth/hooks/useProfilePage'
import {
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from '@/features/auth/api/auth.queries'
import { formatOrderDate } from '@/features/orders/utils/format'

function deviceLabel(userAgent: string | null) {
  if (!userAgent) return 'Unknown device'
  const ua = userAgent.toLowerCase()
  if (ua.includes('iphone') || ua.includes('ipad')) return 'Apple device'
  if (ua.includes('android')) return 'Android device'
  if (ua.includes('mac')) return 'Mac'
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('linux')) return 'Linux'
  return 'Browser session'
}

export function SecuritySection() {
  const profile = useProfilePage()
  const sessions = useSessions()
  const revoke = useRevokeSession()
  const revokeOthers = useRevokeOtherSessions()

  const list = sessions.data ?? []
  const hasOthers = list.some((s) => !s.isCurrent)

  return (
    <div className="space-y-6">
      <ChangePasswordSection
        form={profile.form}
        onSubmit={profile.onSubmit}
        error={profile.error}
        isPending={profile.isPending}
        isSuccess={profile.isSuccess}
        onChangeAgain={profile.resetSuccess}
      />

      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-[1.125rem] text-ink">Active sessions</h2>
            <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
              Devices signed in with your account.
            </p>
          </div>
          {hasOthers ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={revokeOthers.isPending}
              onClick={() => revokeOthers.mutate()}
            >
              Sign out others
            </Button>
          ) : null}
        </div>

        {sessions.isLoading ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : sessions.isError ? (
          <p className="px-5 py-8 text-center text-[0.9375rem] text-ink-muted">
            {(sessions.error as Error)?.message || 'Could not load sessions.'}
          </p>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Monitor}
            heading="No active sessions"
            message="Sign in again to see devices here."
            className="py-12 md:py-14"
            maxWidth="max-w-sm"
          />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((session) => (
              <li
                key={session.family}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {deviceLabel(session.userAgent)}
                    {session.isCurrent ? (
                      <span className="ml-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
                        This device
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                    {session.ipAddress || 'IP unknown'} · Last active{' '}
                    {formatOrderDate(session.lastUsedAt)}
                  </p>
                </div>
                {!session.isCurrent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:text-danger"
                    loading={revoke.isPending && revoke.variables === session.family}
                    onClick={() => revoke.mutate(session.family)}
                  >
                    Revoke
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <div className="px-5 pb-4">
          <FormError
            error={(revoke.error || revokeOthers.error) as Error | null}
            fallback="Could not update sessions."
          />
        </div>
      </section>
    </div>
  )
}
