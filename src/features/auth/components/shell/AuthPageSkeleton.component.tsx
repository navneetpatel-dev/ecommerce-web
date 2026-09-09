import { AuthPageShell } from "@/features/auth/components/shell/AuthPageShell.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { authPageSkeletonStyles as styles } from "../../styles/shell/authPageSkeleton.styles";

/** Form-slot skeleton for login/register/password/OTP route transitions. */
export function AuthFormSkeleton() {
  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <Skeleton className={styles.headerTitle} />
        <Skeleton className={styles.headerSubtitle} />
      </header>
      <div className={styles.body}>
        <div className={styles.fieldGroup}>
          <Skeleton className={styles.label} />
          <Skeleton className={styles.input} />
        </div>
        <div className={styles.fieldGroup}>
          <Skeleton className={styles.labelWide} />
          <Skeleton className={styles.input} />
        </div>
        <Skeleton className={styles.input} />
        <div className={styles.dividerRow}>
          <Skeleton className={styles.dividerLine} />
          <Skeleton className={styles.dividerText} />
          <Skeleton className={styles.dividerLine} />
        </div>
        <Skeleton className={styles.input} />
      </div>
      <footer className={styles.footer}>
        <Skeleton className={styles.footerText} />
      </footer>
    </div>
  );
}

/** Full auth page loading state — brand shell stays; skeleton replaces the form. */
export function AuthPageSkeleton() {
  return (
    <AuthPageShell>
      <AuthFormSkeleton />
    </AuthPageShell>
  );
}
