"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductDetail } from "@/shared/api/types";
import { productsApi } from "../../api/listing/products.api";
import {
  emptyProductListingValues,
  listingValuesFromProduct,
  type ProductListingFormField,
  type ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import type { CategoryOptionData } from "../../types/product-editor/types";
import type { ProductEditorStateOptions } from "../../types/product-editor/editorState.types";
import { categoryOptionOf } from "../../utils/product-editor/categoryOptionOf";
import { useProductPricingLock } from "./useProductPricingLock.hook";
import { usePriceChangeReason } from "./usePriceChangeReason.hook";
import { useProductSave } from "./useProductSave.hook";

export type { ProductEditorStateOptions } from "../../types/product-editor/editorState.types";

/** State and submit logic of the product editor, shared by the vendor and admin product pages. */
export function useProductEditorState(options: ProductEditorStateOptions) {
  const { mode } = options;

  const [values, setValues] = useState<ProductListingFormValues>(() =>
    emptyProductListingValues(),
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [draftUploadId, setDraftUploadId] = useState(() => crypto.randomUUID());
  // The picker loads its own pages when opened; the form only keeps what was chosen.
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOptionData | null>(null);
  const [vendorId, setVendorId] = useState("");
  const [variantRows, setVariantRows] = useState<VariantDraft[]>([]);
  const [variantErrors, setVariantErrors] = useState<
    Record<string, VariantDraftErrors>
  >({});
  const reason = usePriceChangeReason();
  const { reset: resetReason, clearError: clearReasonError } = reason;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    fieldErrors: apiFieldErrors,
    setErrors: setApiFieldErrors,
    clearAll: clearApiFieldErrors,
  } = useManualFormFieldErrors<ProductListingFormField>();
  const [loading, setLoading] = useState(false);

  const pricing = useProductPricingLock(mode === "edit" ? product : null);

  const clearMessages = useCallback(() => {
    setSubmitError(null);
    clearApiFieldErrors();
    setVariantErrors({});
    clearReasonError();
  }, [clearApiFieldErrors, clearReasonError]);

  const resetFormState = useCallback(
    (categoryId?: string) => {
      setValues(emptyProductListingValues(categoryId ?? ""));
      setImageUrls([]);
      setDraftUploadId(crypto.randomUUID());
      setVendorId("");
      setVariantRows([]);
      resetReason();
      setProduct(null);
      setSelectedCategory(null);
      clearMessages();
      setLoading(false);
    },
    [clearMessages, resetReason],
  );

  const loadEditProduct = useCallback(
    async (productId: string) => {
      setValues(emptyProductListingValues(""));
      setImageUrls([]);
      resetReason();
      setProduct(null);
      clearMessages();
      setLoading(true);
      try {
        const loaded = await productsApi.detail(productId);
        setProduct(loaded);
        setSelectedCategory(categoryOptionOf(loaded));
        setValues(listingValuesFromProduct(loaded));
      } catch (err: unknown) {
        setSubmitError(getApiErrorMessage(err, LABELS.couldNotLoadProduct));
      } finally {
        setLoading(false);
      }
    },
    [clearMessages, resetReason],
  );

  const { submitting, handleValidSubmit } = useProductSave({
    ...options,
    vendorId,
    variantRows,
    imageUrls,
    product,
    reasonRequired: pricing.reasonRequired,
    takeReason: reason.take,
    clearMessages,
    resetFormState,
    setVariantErrors,
    setSubmitError,
    setApiFieldErrors,
  });

  return {
    values,
    setValues,
    imageUrls,
    setImageUrls,
    draftUploadId,
    selectedCategory,
    setSelectedCategory,
    vendorId,
    setVendorId,
    variantRows,
    setVariantRows,
    variantErrors,
    product,
    pricing,
    changeReason: reason.value,
    reasonError: reason.error,
    handleReasonChange: reason.onChange,
    submitError,
    apiFieldErrors,
    submitting,
    loading,
    resetFormState,
    loadEditProduct,
    handleValidSubmit,
  };
}
