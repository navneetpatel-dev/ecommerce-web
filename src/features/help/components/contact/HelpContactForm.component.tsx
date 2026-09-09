"use client";

import Link from "next/link";
import { FormSection, FormStack } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { helpContactFormStyles as styles } from "../../styles/contact/helpContactForm.styles";

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
    <div className={styles.container}>
      <FormStack>
        <FormSection
          title={LABELS.helpContactSection}
          hint={LABELS.helpContactSectionHint}
        >
          <div className={styles.sectionContent}>
            <p className={styles.contactMessage}>{contactMessage}</p>
            <Button asChild>
              <Link href={contactHref}>{LABELS.helpOpenSupportTicket}</Link>
            </Button>
          </div>
        </FormSection>
      </FormStack>
    </div>
  );
}
