import type { ReactNode } from "react";
import { visuallyHiddenHeadingStyles as styles } from "../../styles/a11y/visuallyHiddenHeading.styles";

/**
 * A page title for screen readers on states that show no visible heading yet
 * (loading, empty, error), so heading navigation always finds the page (B-62).
 */
export function VisuallyHiddenHeading({ children }: { children: ReactNode }) {
  return <h1 className={styles.heading}>{children}</h1>;
}
