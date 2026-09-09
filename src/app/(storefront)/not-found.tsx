import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

import { notFoundStyles as styles } from "@/shared/styles/notFound.styles";

/** Nested under (storefront) layout — do not wrap StorefrontLayout again. */
export default function StorefrontNotFound() {
  return (
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
  );
}
