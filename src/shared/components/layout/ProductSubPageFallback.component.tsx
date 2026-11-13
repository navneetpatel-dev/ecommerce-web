import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";

interface ProductSubPageFallbackProps {
  loadFailed: boolean;
  onRetry: () => void;
}

/** Reviews / questions page whose product could not be shown: outage vs. missing. */
export function ProductSubPageFallback({
  loadFailed,
  onRetry,
}: ProductSubPageFallbackProps) {
  if (loadFailed) {
    return (
      <ErrorState
        headingLevel="h1"
        heading={LABELS.productLoadFailedTitle}
        message={LABELS.productLoadFailedBody}
        onRetry={onRetry}
      />
    );
  }
  return (
    <ErrorState
      variant="notFound"
      headingLevel="h1"
      heading={LABELS.productNotFoundTitle}
      message={LABELS.productNotFoundBody}
      action={
        <Button asChild variant="outline">
          <Link href={PATHS.products}>{LABELS.allProducts}</Link>
        </Button>
      }
    />
  );
}
