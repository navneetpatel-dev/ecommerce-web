"use client";

import Link from "next/link";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { HelpContactForm } from "../../contact/HelpContactForm.component";
import { helpHomeViewStyles as styles } from "../../../styles/home/helpHomeView.styles";

export function ContactSection() {
  return (
    <section id="contact" className={styles.contactSection}>
      <TextEyebrow brand>{LABELS.helpStillStuckEyebrow}</TextEyebrow>
      <h2
        className={styles.contactTitle}
        style={{ fontSize: "var(--text-display-sm)" }}
      >
        {LABELS.helpContactSupportHeading}
      </h2>
      <p className={styles.contactHint}>{LABELS.helpContactDeskHint}</p>
      <div className={styles.contactLinks}>
        <Link href={PATHS.supportTickets} className={styles.contactLink}>
          {LABELS.mySupportTickets}
        </Link>
        <Link href={PATHS.bugReportNew} className={styles.contactLink}>
          {LABELS.reportABug}
        </Link>
      </div>
      <div className={styles.contactFormWrapper}>
        <HelpContactForm />
      </div>
    </section>
  );
}
