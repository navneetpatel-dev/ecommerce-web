"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { productDetailsMiscStyles as styles } from "../../styles/detail/productDetailsMisc.styles";

const PRODUCT_FALLBACK_COPY = {
  // A failed load is not a missing product: say so (B-13).
  error: {
    heading: LABELS.productLoadFailedTitle,
    message: LABELS.productLoadFailedBody,
  },
  notFound: {
    heading: LABELS.productNotFoundTitle,
    message: LABELS.productNotFoundBody,
  },
} as const;

/**
 * Distinguishes a genuine 404 from a failed load (Rule 13):
 * - `variant="notFound"`: the product does not exist.
 * - `variant="error"`: the request failed — offer retry.
 */
export function ProductNotFound(props: {
  variant?: "notFound" | "error";
  onRetry?: () => void;
}) {
  const { variant = "notFound", onRetry } = props;
  const copy = PRODUCT_FALLBACK_COPY[variant];

  const handleReset = () => onRetry?.();
  const retry = variant === "error" ? handleReset : undefined;

  return (
    <div className={styles.notFoundContainer}>
      <ErrorState
        variant={variant}
        headingLevel="h1"
        heading={copy.heading}
        message={copy.message}
        onRetry={retry}
        action={
          <Button
            variant="outline"
            className={styles.notFoundBackButton}
            asChild
          >
            <Link href={PATHS.home}>{LABELS.backToHome}</Link>
          </Button>
        }
      />
    </div>
  );
}
