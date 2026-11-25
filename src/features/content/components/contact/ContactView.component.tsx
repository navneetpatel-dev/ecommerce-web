import Link from "next/link";
import { ArrowRight, Clock, Mail, ShieldCheck } from "lucide-react";
import { HelpContactForm } from "@/features/help";
import { ContactMessageForm } from "./ContactMessageForm.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { contactViewStyles as styles } from "../../styles/contact/contactView.styles";

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
    <div className={styles.root}>
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Customer Care</p>
          <h1 className={styles.heading}>{LABELS.contactUsHeading}</h1>
          <p className={styles.intro}>{LABELS.contactUsIntro}</p>
        </header>

        <div className={styles.layoutGrid}>
          <section
            aria-label={LABELS.contactFormTitle}
            className={styles.formColumn}
          >
            <div className={styles.formCard}>
              <ContactMessageForm />
            </div>
          </section>

          <aside
            aria-label={LABELS.contactSupportDetails}
            className={styles.sidebarColumn}
          >
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {LABELS.contactSupportDetails}
              </h2>
              <p className={styles.cardSubtitle}>
                Direct channels and response hours for our care team.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <div className={styles.iconBox}>
                    <Mail size={18} aria-hidden />
                  </div>
                  <div className={styles.infoContent}>
                    <p className={styles.infoLabel}>Email</p>
                    {isLoading ? (
                      <p className={styles.infoMuted}>
                        {LABELS.contactLoadingDetails}
                      </p>
                    ) : supportEmail ? (
                      <a
                        href={`mailto:${supportEmail}`}
                        className={styles.infoLink}
                      >
                        {supportEmail}
                      </a>
                    ) : (
                      <p className={styles.infoMuted}>
                        {LABELS.contactNotConfigured}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.iconBox}>
                    <Clock size={18} aria-hidden />
                  </div>
                  <div className={styles.infoContent}>
                    <p className={styles.infoLabel}>Working Hours</p>
                    {isLoading ? (
                      <p className={styles.infoMuted}>
                        {LABELS.contactLoadingDetails}
                      </p>
                    ) : (
                      <p className={styles.infoValue}>
                        {supportHours ?? LABELS.contactNotConfigured}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.iconBox}>
                    <ShieldCheck size={18} aria-hidden />
                  </div>
                  <div className={styles.infoContent}>
                    <p className={styles.infoLabel}>Response Time</p>
                    <p className={styles.infoValue}>
                      Within 1 business day with a tracked reference
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <HelpContactForm />
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Self-Serve Resources</h2>
              <p className={styles.cardSubtitle}>
                {LABELS.contactPreferSelfServe} {LABELS.helpCenter}.
              </p>
              <nav
                aria-label="Self-serve support links"
                className={styles.quickLinksList}
              >
                <Link href={PATHS.help} className={styles.quickLink}>
                  <span>{LABELS.helpCenter}</span>
                  <ArrowRight size={15} className={styles.quickLinkIcon} />
                </Link>
                <Link href={PATHS.orderTracking} className={styles.quickLink}>
                  <span>Track an Order</span>
                  <ArrowRight size={15} className={styles.quickLinkIcon} />
                </Link>
                <Link href={PATHS.returns} className={styles.quickLink}>
                  <span>Returns &amp; Refunds Policy</span>
                  <ArrowRight size={15} className={styles.quickLinkIcon} />
                </Link>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
