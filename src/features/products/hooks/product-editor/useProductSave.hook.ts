"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import type { ProductDetail } from "@/shared/api/types";
import { productsApi } from "../../api/listing/products.api";
import type {
  ProductListingFormField,
  ProductWriteBody,
} from "../../schemas/listing-form/products.schema";
import { createProductWithImages } from "../../utils/product-editor/createProductWithImages";
import { pricingFieldsChanged } from "../../utils/product-editor/pricingChanges";
import { collectVariants } from "../../utils/product-editor/collectVariants";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import type { ProductEditorStateOptions } from "../../types/product-editor/editorState.types";

interface ProductSaveParams extends ProductEditorStateOptions {
  vendorId: string;
  variantRows: VariantDraft[];
  imageUrls: string[];
  product: ProductDetail | null;
  /** Whether a price change on this product needs a written reason. */
  reasonRequired: boolean;
  takeReason: () => string | null;
  clearMessages: () => void;
  resetFormState: () => void;
  setVariantErrors: (errors: Record<string, VariantDraftErrors>) => void;
  setSubmitError: (message: string | null) => void;
  setApiFieldErrors: Parameters<
    typeof applyApiErrorsToManualForm<ProductListingFormField>
  >[1];
}

/** Creating or updating the product once its form is valid. */
export function useProductSave({
  mode,
  editId,
  close,
  onSaved,
  requireVendor = false,
  vendorId,
  variantRows,
  imageUrls,
  product,
  reasonRequired,
  takeReason,
  clearMessages,
  resetFormState,
  setVariantErrors,
  setSubmitError,
  setApiFieldErrors,
}: ProductSaveParams) {
  const [submitting, setSubmitting] = useState(false);

  /** Undefined when no reason is needed, null when one is needed and missing. */
  const reasonFor = (body: ProductWriteBody) =>
    reasonRequired && product && pricingFieldsChanged(product, body)
      ? takeReason()
      : undefined;

  const variantsToCreate = () => {
    const { errors, bodies } = collectVariants(variantRows);
    setVariantErrors(errors);
    return bodies;
  };

  const handleValidSubmit = async (body: ProductWriteBody) => {
    clearMessages();
    const editing = mode === "edit" && Boolean(editId);

    if (!editing && requireVendor && !vendorId) {
      setSubmitError(LABELS.listForVendorRequired);
      return;
    }
    const variants = editing ? [] : variantsToCreate();
    if (variants === null) return;

    const reason = editing ? reasonFor(body) : undefined;
    if (reason === null) return;

    setSubmitting(true);
    try {
      if (editing && editId) {
        await productsApi.update(editId, {
          ...body,
          ...(reason ? { changeReason: reason } : {}),
        });
      } else {
        await createProductWithImages(body, imageUrls, {
          onBehalf: requireVendor,
          vendorId: vendorId || undefined,
          variants,
        });
      }
      close();
      resetFormState();
      onSaved();
    } catch (err: unknown) {
      const mapped = applyApiErrorsToManualForm<ProductListingFormField>(
        err,
        setApiFieldErrors,
      );
      setSubmitError(
        mapped ? null : getFormLevelApiError(err, LABELS.couldNotSaveProduct),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, handleValidSubmit };
}
