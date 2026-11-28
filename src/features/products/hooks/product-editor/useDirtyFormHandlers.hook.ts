"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { ProductListingFormValues } from "../../schemas/listing-form/products.schema";
import type { VariantDraft } from "../../utils/product-editor/variantDrafts";

interface EditableProductForm {
  setValues: Dispatch<SetStateAction<ProductListingFormValues>>;
  setImageUrls: (urls: string[]) => void;
  setVariantRows: (rows: VariantDraft[]) => void;
}

/** User edits mark the form dirty so the dialog can confirm before discarding. */
export function useDirtyFormHandlers(form: EditableProductForm) {
  const [formDirty, setFormDirty] = useState(false);

  const handleFormChange = (patch: Partial<ProductListingFormValues>) => {
    setFormDirty(true);
    form.setValues((current) => ({ ...current, ...patch }));
  };
  const handleImageUrlsChange = (urls: string[]) => {
    setFormDirty(true);
    form.setImageUrls(urls);
  };
  const handleVariantRowsChange = (rows: VariantDraft[]) => {
    setFormDirty(true);
    form.setVariantRows(rows);
  };

  return {
    formDirty,
    setFormDirty,
    handleFormChange,
    handleImageUrlsChange,
    handleVariantRowsChange,
  };
}
