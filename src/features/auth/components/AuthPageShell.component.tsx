import Link from "next/link";
import { AuthBrandFeatures } from "@/features/auth/components/AuthBrandFeatures.component";
import { AuthBrandVisual } from "@/features/auth/components/AuthBrandVisual.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { authPageShellStyles as styles } from "./authPageShell.styles";

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.bgGradient1} />
      <div aria-hidden className={styles.bgGradient2} />
      <div aria-hidden className={styles.bgGradient3} />

      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <Link href={PATHS.home} className={styles.brandLink}>
            {LABELS.brandName}
          </Link>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        <aside className={styles.brandAside}>
          <AuthBrandVisual />

          <div className={styles.brandContent}>
            <div className={styles.brandBlock}>
              <div className={styles.brandTextStack}>
                <p className={styles.brandEyebrow}>{LABELS.authBrandEyebrow}</p>
                <p className={styles.brandHeadline}>
                  {LABELS.authBrandHeadline}
                </p>
                <p className={styles.brandBody}>{LABELS.authBrandBody}</p>
              </div>

              <AuthBrandFeatures className={styles.brandFeatures} />
            </div>

            <p className={styles.brandFooter}>{LABELS.authBrandFooter}</p>
          </div>
        </aside>

        <main className={styles.mainCol}>
          <div aria-hidden className={styles.ambientBlob} />

          <div className={styles.formWrapper}>
            <div className={styles.formAnimation}>
              <div aria-hidden className={styles.formGlow} />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
