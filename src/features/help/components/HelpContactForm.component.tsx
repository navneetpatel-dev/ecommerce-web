"use client";

import Link from "next/link";
import { FormSection, FormStack } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useAuthStore } from "@/shared/stores/auth.store";

export function HelpContactForm() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isLoggedIn = Boolean(currentUser);
  const contactMessage = isLoggedIn
    ? LABELS.helpContactUseSupport
    : LABELS.helpContactSignIn;
  const contactHref = isLoggedIn
    ? PATHS.supportTicketNew
    : PATHS.loginWithRedirect(PATHS.supportTicketNew);

  return (
    <div className="max-w-2xl">
      <FormStack>
        <FormSection
          title={LABELS.helpContactSection}
          hint={LABELS.helpContactSectionHint}
        >
          <div className="space-y-4 sm:col-span-2">
            <p className="text-body leading-relaxed text-ink-muted">
              {contactMessage}
            </p>
            <Button asChild>
              <Link href={contactHref}>{LABELS.helpOpenSupportTicket}</Link>
            </Button>
          </div>
        </FormSection>
      </FormStack>
    </div>
  );
}
