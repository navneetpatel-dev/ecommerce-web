"use client";

import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useProductPreview } from "../../hooks/preview/useProductPreview.hook";
import { productPreviewStyles as styles } from "../../styles/preview/productPreview.styles";
import { ProductPreviewDialogShell } from "./ProductPreviewDialogShell.component";
import { ProductDetailContent } from "../detail/ProductDetailContent/index";
import { ProductDetailSkeleton } from "../detail/ProductDetailSkeleton.component";
import { ProductNotFound } from "../detail/ProductNotFound.component";
import { ProductRejectionNote } from "../status/ProductRejectionNote.component";

interface ProductCustomerPreviewDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * "View as customer": the product page exactly as a shopper will see it, in a dialog, for any
 * product the team can open (a draft too). Buying is disabled; the notice says if it is not live yet.
 */
export function ProductCustomerPreviewDialog({
  productId,
  open,
  onOpenChange,
}: ProductCustomerPreviewDialogProps) {
  const preview = useProductPreview(productId, open);
  const notLive =
    preview.product && preview.product.status !== PRODUCT_STATUS.LIVE;

  return (
    <ProductPreviewDialogShell
      open={open}
      onOpenChange={onOpenChange}
      notice={
        notLive && preview.product ? (
          <div role="status" className={styles.notLiveNotice}>
            <p>
              {formatLabel(LABELS.customerPreviewNotLive, {
                status: preview.product.status.replace(/_/g, " ").toLowerCase(),
              })}
            </p>
            <ProductRejectionNote
              status={preview.product.status}
              note={preview.product.rejectionNote}
            />
          </div>
        ) : null
      }
    >
      {preview.isLoading ? (
        <ProductDetailSkeleton />
      ) : preview.detailProps ? (
        <ProductDetailContent {...preview.detailProps} />
      ) : (
        <ProductNotFound
          variant={preview.isError ? "error" : undefined}
          onRetry={preview.retry}
        />
      )}
    </ProductPreviewDialogShell>
  );
}
