'use client'

import Link from 'next/link'
import { FormSection, FormStack } from '@/shared/components/forms'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function HelpContactForm() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const isLoggedIn = Boolean(currentUser)

  return (
    <div className="max-w-2xl">
      <FormStack>
        <FormSection title={LABELS.helpContactSection} hint={LABELS.helpContactSectionHint}>
          <div className="space-y-4 sm:col-span-2">
            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
              {isLoggedIn ? LABELS.helpContactUseSupport : LABELS.helpContactSignIn}
            </p>
            <Button asChild>
              <Link
                href={
                  isLoggedIn
                    ? PATHS.supportTicketNew
                    : PATHS.loginWithRedirect(PATHS.supportTicketNew)
                }
              >
                {LABELS.helpOpenSupportTicket}
              </Link>
            </Button>
          </div>
        </FormSection>
      </FormStack>
    </div>
  )
}
