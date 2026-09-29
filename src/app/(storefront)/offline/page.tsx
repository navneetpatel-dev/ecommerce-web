import Link from "next/link";
import type { Metadata } from "next";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { offlinePageStyles as styles } from "@/shared/styles/system/offlineNotice.styles";

export const metadata: Metadata = generateNoIndexMetadata(
  LABELS.offlinePageTitle,
);

/**
 * Served by the service worker when a navigation fails and no cached copy of
 * the page exists. Static server HTML on purpose: it must render with no
 * network and no client bundle.
 */
export default function OfflinePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{LABELS.offlinePageTitle}</h1>
      <p className={styles.body}>{LABELS.offlinePageBody}</p>
      <div className={styles.actions}>
        <Link href={PATHS.home} className={styles.primaryAction}>
          {LABELS.offlinePageHome}
        </Link>
      </div>
    </div>
  );
}
