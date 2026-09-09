import Link from "next/link";
import { HelpContactForm } from "@/features/help";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { contactViewStyles as styles } from "./contactView.styles";

interface ContactViewProps {
  supportEmail: string | null;
  supportHours: string | null;
  isLoading: boolean;
}

export function ContactView({
  supportEmail,
  supportHours,
  isLoading,
}: ContactViewProps) {
  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <h1 className={styles.heading}>{LABELS.contactUsHeading}</h1>
        <p className={styles.intro}>{LABELS.contactUsIntro}</p>
        <HelpContactForm />
      </section>
      <aside className={styles.detailsCard}>
        <h2 className={styles.cardTitle}>{LABELS.contactSupportDetails}</h2>
        {isLoading && (
          <p className={styles.detailText}>{LABELS.contactLoadingDetails}</p>
        )}
        {!isLoading && (
          <>
            <p className={styles.detailText}>
              {formatLabel(LABELS.contactEmailLabel, {
                email: supportEmail ?? LABELS.contactNotConfigured,
              })}
            </p>
            <p className={styles.detailText}>
              {formatLabel(LABELS.contactHoursLabel, {
                hours: supportHours ?? LABELS.contactNotConfigured,
              })}
            </p>
          </>
        )}
        <p className={styles.selfServeNotice}>
          {LABELS.contactPreferSelfServe}{" "}
          <Link href={PATHS.help} className={styles.helpLink}>
            {LABELS.helpCenter}
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
