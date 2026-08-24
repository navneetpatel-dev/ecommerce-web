"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/components/errorBoundary.styles";

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

  return (
    <div className="storefront-container py-16 text-center">
      <p className="text-ink-muted text-body-lg">
        {LABELS.productNotFoundTitle}
      </p>
      {variant === "error" ? (
        <div className={styles.root}>
          <ErrorFallbackActions onReset={() => onRetry?.()} />
        </div>
      ) : (
        <Button variant="outline" className="mt-4" asChild>
          <Link href={PATHS.home}>{LABELS.backToHome}</Link>
        </Button>
      )}
    </div>
  );
}
