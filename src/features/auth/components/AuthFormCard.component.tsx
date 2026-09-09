import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { authFormsStyles as styles } from "./authForms.styles";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Shared surface for login / register / password / OTP forms. */
export function AuthFormCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthFormCardProps) {
  return (
    <div className={cn(styles.cardRoot, className)}>
      <header className={styles.cardHeader}>
        <h1 className={styles.cardTitle}>{title}</h1>
        <p className={styles.cardDescription}>{description}</p>
      </header>
      <div className={styles.cardBody}>{children}</div>
      {footer ? <footer className={styles.cardFooter}>{footer}</footer> : null}
    </div>
  );
}
