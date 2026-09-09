"use client";

import Link from "next/link";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { HELP_QUICK_LINKS } from "../../../constants/helpContent";
import { helpHomeViewStyles as styles } from "./helpHomeView.styles";

export function QuickLinksSection() {
  const linkElements = HELP_QUICK_LINKS.map((link) => (
    <li key={link.href}>
      <Link href={link.href} className={styles.quickLinkCard}>
        <span className={styles.quickLinkLabel}>{link.label}</span>
        <span className={styles.quickLinkDesc}>{link.description}</span>
      </Link>
    </li>
  ));

  return (
    <section className={styles.quickLinksSection}>
      <TextEyebrow>{LABELS.helpQuickLinksEyebrow}</TextEyebrow>
      <ul className={styles.quickLinksGrid}>{linkElements}</ul>
    </section>
  );
}
