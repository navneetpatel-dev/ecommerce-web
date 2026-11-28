"use client";

import { useState } from "react";

export interface ProductTarget {
  id: string;
  name: string;
}

/** The dialogs opened from a product row beside the editor: variants, preview and submit. */
export function useProductSideDialogs(onChanged: () => void) {
  const [variantsTarget, setVariantsTarget] = useState<ProductTarget | null>(
    null,
  );
  const [submitTarget, setSubmitTarget] = useState<ProductTarget | null>(null);
  const [previewTarget, setPreviewTarget] = useState<ProductTarget | null>(
    null,
  );

  const variantsDialogProps = variantsTarget
    ? {
        productId: variantsTarget.id,
        productName: variantsTarget.name,
        open: true,
        onOpenChange: (next: boolean) => {
          if (!next) setVariantsTarget(null);
        },
        onChanged,
      }
    : null;

  const previewDialogProps = previewTarget
    ? {
        productId: previewTarget.id,
        open: true,
        onOpenChange: (next: boolean) => {
          if (!next) setPreviewTarget(null);
        },
      }
    : null;

  const submitDialogProps = submitTarget
    ? {
        productId: submitTarget.id,
        productName: submitTarget.name,
        open: true,
        onOpenChange: (next: boolean) => {
          if (!next) setSubmitTarget(null);
        },
        onSubmitted: () => {
          setSubmitTarget(null);
          onChanged();
        },
      }
    : null;

  return {
    openVariants: setVariantsTarget,
    openSubmit: setSubmitTarget,
    openPreview: setPreviewTarget,
    previewDialogProps,
    variantsDialogProps,
    submitDialogProps,
  };
}
