import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StorefrontLayout } from "@/features/storefront";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

import { notFoundStyles as styles } from "@/shared/styles/notFound.styles";

export const metadata: Metadata = {
  title: LABELS.pageNotFound,
  robots: { index: false, follow: false },
};

/** Root fallback for routes outside (storefront). */
export default function NotFound() {
  return (
    <StorefrontLayout>
      <div className={styles.container}>
        <PackageSearch size={160} className={styles.icon} strokeWidth={1} />
        <h1
          className={styles.heading}
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {LABELS.pageNotFound}
        </h1>
        <p className={styles.body}>{LABELS.pageNotFoundBody}</p>
        <Button asChild>
          <Link href={PATHS.home}>{LABELS.goToHomepage}</Link>
        </Button>
      </div>
    </StorefrontLayout>
  );
}
