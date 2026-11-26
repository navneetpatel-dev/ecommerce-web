"use client";

import { useLiveProductPreview } from "../../hooks/preview/useLiveProductPreview.hook";
import type { PreviewProductInput } from "../../utils/preview/buildPreviewProduct";
import { ProductDetailContent } from "../detail/ProductDetailContent/index";
import { ProductPreviewDialogShell } from "./ProductPreviewDialogShell.component";

interface ProductLivePreviewDialogProps extends Omit<
  PreviewProductInput,
  "pricing"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The customer's page for the product as it is in the form right now, in its own dialog on top of
 * the product dialog. Loaded on demand (it pulls in the whole product page).
 */
export default function ProductLivePreviewDialog({
  open,
  onOpenChange,
  ...input
}: ProductLivePreviewDialogProps) {
  const detailProps = useLiveProductPreview(input);
  return (
    <ProductPreviewDialogShell open={open} onOpenChange={onOpenChange}>
      {detailProps ? <ProductDetailContent {...detailProps} /> : null}
    </ProductPreviewDialogShell>
  );
}
