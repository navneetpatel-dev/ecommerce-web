"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  categoriesApi,
  flattenCategoriesWithDepth,
} from "@/features/categories";
import {
  productsApi,
  emptyProductListingValues,
  listingValuesFromProduct,
  type ProductListingFormValues,
  type ProductWriteBody,
  type ProductListingFormField,
} from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export function useVendorProductFormState(options: {
  mode: "create" | "edit" | null;
  editId: string | null;
  close: () => void;
}) {
  const { mode, editId, close } = options;
  const router = useRouter();

  const [values, setValues] = useState<ProductListingFormValues>(() =>
    emptyProductListingValues(),
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [draftUploadId, setDraftUploadId] = useState(() => crypto.randomUUID());
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    fieldErrors: apiFieldErrors,
    setErrors: setApiFieldErrors,
    clearAll: clearApiFieldErrors,
  } = useManualFormFieldErrors<ProductListingFormField>();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void categoriesApi.list().then((rows) => {
      const tree = Array.isArray(rows) ? rows : [];
      const flat = flattenCategoriesWithDepth(tree).map((row) => ({
        id: row.id,
        name: `${"— ".repeat(row.depth)}${row.name}`.trim(),
      }));
      setCategories(flat);
      setValues((current) =>
        current.categoryId || !flat[0]?.id
          ? current
          : { ...current, categoryId: String(flat[0].id) },
      );
    });
  }, []);

  const resetFormState = useCallback(
    (categoryId?: string) => {
      setValues(
        emptyProductListingValues(categoryId ?? categories[0]?.id ?? ""),
      );
      setImageUrls([]);
      setDraftUploadId(crypto.randomUUID());
      setSubmitError(null);
      clearApiFieldErrors();
      setLoading(false);
    },
    [categories],
  );

  const loadEditProduct = useCallback(
    async (productId: string) => {
      setValues(emptyProductListingValues(categories[0]?.id ?? ""));
      setImageUrls([]);
      setSubmitError(null);
      clearApiFieldErrors();
      setLoading(true);
      try {
        const product = await productsApi.detail(productId);
        setValues(listingValuesFromProduct(product));
      } catch (err: unknown) {
        setSubmitError(getApiErrorMessage(err, LABELS.couldNotLoadProduct));
      } finally {
        setLoading(false);
      }
    },
    [categories],
  );

  const handleValidSubmit = useCallback(
    async (body: ProductWriteBody) => {
      setSubmitting(true);
      setSubmitError(null);
      clearApiFieldErrors();
      try {
        if (mode === "edit" && editId) {
          await productsApi.update(editId, body);
        } else {
          const product = await productsApi.create(body);
          for (let index = 0; index < imageUrls.length; index += 1) {
            const url = imageUrls[index]!;
            await productsApi.addImage(product.id, {
              url,
              isPrimary: index === 0,
            });
          }
        }
        close();
        resetFormState(categories[0]?.id);
        router.refresh();
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
    },
    [categories, close, editId, imageUrls, mode, resetFormState, router],
  );

  return {
    values,
    setValues,
    imageUrls,
    setImageUrls,
    draftUploadId,
    categories,
    submitError,
    apiFieldErrors,
    submitting,
    loading,
    resetFormState,
    loadEditProduct,
    handleValidSubmit,
  };
}
