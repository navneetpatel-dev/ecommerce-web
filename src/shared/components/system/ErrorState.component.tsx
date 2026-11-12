import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { ErrorFallbackActions } from "./ErrorFallbackActions.component";
import {
  ErrorIllustration,
  type ErrorIllustrationVariant,
} from "./ErrorIllustration.component";
import { errorStateStyles as styles } from "../../styles/system/errorState.styles";

export type ErrorStateSize = "page" | "screen" | "section";

const EYEBROW_BY_VARIANT: Record<ErrorIllustrationVariant, string> = {
  error: LABELS.errorStateEyebrow,
  notFound: LABELS.notFoundStateEyebrow,
};

interface ErrorStateProps {
  /** Picks the illustration and eyebrow: a failed load vs. something that does not exist. */
  variant?: ErrorIllustrationVariant;
  heading: string;
  message: string;
  /** When set, renders the standard "Try again" + "Back to home" actions. */
  onRetry?: () => void;
  /** Custom actions, used when there is no `onRetry` (e.g. a not-found link). */
  action?: ReactNode;
  /** Error digest shown to the customer so support can trace the failure. */
  reference?: string;
  /** Use `h1` when this state replaces the whole page body. */
  headingLevel?: "h1" | "h2";
  /** `page` sits inside a shell, `screen` fills the viewport, `section` sits inside a page. */
  size?: ErrorStateSize;
  className?: string;
}

/**
 * The single illustrated fallback for route error boundaries, page-level load
 * failures and not-found states, so every surface fails the same way (Rule 13).
 */
export function ErrorState({
  variant = "error",
  heading,
  message,
  onRetry,
  action,
  reference,
  headingLevel = "h2",
  size = "page",
  className,
}: ErrorStateProps) {
  const Heading = headingLevel;
  const actions = onRetry ? <ErrorFallbackActions onReset={onRetry} /> : action;

  return (
    <section className={cn(styles.root, styles.rootBySize[size], className)}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.content}>
        <ErrorIllustration
          variant={variant}
          className={styles.illustrationBySize[size]}
        />
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDotByVariant[variant]} aria-hidden />
          {EYEBROW_BY_VARIANT[variant]}
        </p>
        <Heading className={styles.heading}>{heading}</Heading>
        <p className={styles.message}>{message}</p>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
        {reference ? (
          <p className={styles.reference}>
            {LABELS.errorReference}
            <code className={styles.referenceCode}>{reference}</code>
          </p>
        ) : null}
      </div>
    </section>
  );
}
