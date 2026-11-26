"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { ProductDetail } from "@/shared/api/types";
import { productEditorDialogStyles as styles } from "../../styles/product-editor/productEditorForm.styles";
import type { ProductEditorFormProps } from "../../types/product-editor/types";
import { ProductEditorForm } from "./ProductEditorForm.component";

// The preview pulls in the whole customer product page, so it is fetched only when first opened.
const ProductLivePreviewDialog = dynamic(
  () => import("../preview/ProductLivePreviewDialog.component"),
  { loading: () => null },
);

interface ProductEditorDialogBodyProps {
  mode: "create" | "edit";
  formProps: Omit<ProductEditorFormProps, "mode" | "onCancel" | "onPreview">;
  onCancel: () => void;
  /** The saved product when editing (its images and variants are managed separately). */
  savedProduct?: ProductDetail | null;
}

/**
 * Inside the product dialog: the form, and the "Preview" button that opens the customer's page for
 * the product as it is in the form right now. The preview is a separate dialog on top, so closing
 * it leaves this one (and everything typed) untouched. Lives inside the dialog content, so the
 * preview is closed whenever the dialog is.
 */
export function ProductEditorDialogBody({
  mode,
  formProps,
  onCancel,
  savedProduct = null,
}: ProductEditorDialogBodyProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const openPreview = () => setPreviewOpen(true);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "edit" ? LABELS.editProductTitle : LABELS.createProduct}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className={styles.description}>
        {mode === "edit" ? LABELS.editProductBody : LABELS.createProductBody}
      </DialogDescription>

      <ProductEditorForm
        mode={mode}
        {...formProps}
        onCancel={onCancel}
        onPreview={openPreview}
      />

      {previewOpen ? (
        <ProductLivePreviewDialog
          open
          onOpenChange={setPreviewOpen}
          values={formProps.values}
          mode={mode}
          imageUrls={formProps.imageUrls}
          variantRows={formProps.variants?.rows ?? []}
          saved={savedProduct}
          category={formProps.category.selected}
        />
      ) : null}
    </>
  );
}
