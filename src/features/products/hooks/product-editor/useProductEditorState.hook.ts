"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductDetail } from "@/shared/api/types";
import { ADMIN_NOTE_LIMITS } from "../../constants/listing-form/productFields";
import { productsApi } from "../../api/listing/products.api";
import {
  emptyProductListingValues,
  listingValuesFromProduct,
  type ProductListingFormField,
  type ProductListingFormValues,
  type ProductWriteBody,
} from "../../schemas/listing-form/products.schema";
import { createProductWithImages } from "../../utils/product-editor/createProductWithImages";
import { pricingFieldsChanged } from "../../utils/product-editor/pricingChanges";
import {
  isBlankDraft,
  toVariantBody,
  validateVariantDraft,
  variantMessages,
  type VariantDraft,
  type VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import type { CategoryOptionData } from "../../types/product-editor/types";
import { useProductPricingLock } from "./useProductPricingLock.hook";

export interface ProductEditorStateOptions {
  mode: "create" | "edit" | null;
  editId: string | null;
  close: () => void;
  /** Called after a successful save (refresh the list). */
  onSaved: () => void;
  /** Admin: the product is listed for a vendor chosen in the form. */
  requireVendor?: boolean;
  /** Super Admin: the vendor may be left empty to create the platform's own product. */
  allowPlatformProduct?: boolean;
}

const MIN_REASON = ADMIN_NOTE_LIMITS.MIN;

/** State and submit logic of the product editor, shared by the vendor and admin product pages. */
export function useProductEditorState(options: ProductEditorStateOptions) {
  const {
    mode,
    editId,
    close,
    onSaved,
    requireVendor = false,
    allowPlatformProduct = false,
  } = options;

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
  const [changeReason, setChangeReason] = useState("");
  const [reasonError, setReasonError] = useState<string | undefined>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    fieldErrors: apiFieldErrors,
    setErrors: setApiFieldErrors,
    clearAll: clearApiFieldErrors,
  } = useManualFormFieldErrors<ProductListingFormField>();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricing = useProductPricingLock(mode === "edit" ? product : null);

  const clearMessages = useCallback(() => {
    setSubmitError(null);
    clearApiFieldErrors();
    setVariantErrors({});
    setReasonError(undefined);
  }, [clearApiFieldErrors]);

  const resetFormState = useCallback(
    (categoryId?: string) => {
      setValues(emptyProductListingValues(categoryId ?? ""));
      setImageUrls([]);
      setDraftUploadId(crypto.randomUUID());
      setVendorId("");
      setVariantRows([]);
      setChangeReason("");
      setProduct(null);
      setSelectedCategory(null);
      clearMessages();
      setLoading(false);
    },
    [clearMessages],
  );

  const loadEditProduct = useCallback(
    async (productId: string) => {
      setValues(emptyProductListingValues(""));
      setImageUrls([]);
      setChangeReason("");
      setProduct(null);
      clearMessages();
      setLoading(true);
      try {
        const loaded = await productsApi.detail(productId);
        setProduct(loaded);
        setSelectedCategory(
          loaded.category
            ? {
                id: loaded.category.id,
                name: loaded.category.name,
                imageUrl: loaded.category.imageUrl ?? null,
              }
            : null,
        );
        setValues(listingValuesFromProduct(loaded));
      } catch (err: unknown) {
        setSubmitError(getApiErrorMessage(err, LABELS.couldNotLoadProduct));
      } finally {
        setLoading(false);
      }
    },
    [clearMessages],
  );

  /** Non-blank variant rows as request bodies, or null (with errors shown) when a row is incomplete. */
  const collectVariants = () => {
    const filled = variantRows.filter((row) => !isBlankDraft(row));
    const errors: Record<string, VariantDraftErrors> = {};
    for (const row of filled) {
      const rowErrors = validateVariantDraft(row, variantMessages(LABELS));
      if (Object.keys(rowErrors).length) errors[row.key] = rowErrors;
    }
    setVariantErrors(errors);
    return Object.keys(errors).length ? null : filled.map(toVariantBody);
  };

  const handleValidSubmit = async (body: ProductWriteBody) => {
    clearMessages();
    const editing = mode === "edit" && Boolean(editId);

    if (!editing && requireVendor && !vendorId && !allowPlatformProduct) {
      setSubmitError(LABELS.listForVendorRequired);
      return;
    }
    const variants = editing ? [] : collectVariants();
    if (variants === null) return;

    let reason: string | undefined;
    if (editing && pricing.reasonRequired && product) {
      if (pricingFieldsChanged(product, body)) {
        reason = changeReason.trim();
        if (reason.length < MIN_REASON) {
          setReasonError(LABELS.priceChangeReasonRequired);
          return;
        }
      }
    }

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

  const handleReasonChange = (value: string) => {
    setChangeReason(value);
    setReasonError(undefined);
  };

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
    changeReason,
    reasonError,
    handleReasonChange,
    submitError,
    apiFieldErrors,
    submitting,
    loading,
    resetFormState,
    loadEditProduct,
    handleValidSubmit,
  };
}
