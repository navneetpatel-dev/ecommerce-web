"use client";

import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductDetail } from "@/shared/api/types";
import { productsApi } from "../../api/listing/products.api";
import {
  toVariantBody,
  validateVariantDraft,
  variantMessages,
  type VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import {
  draftOf,
  validateVariantEdit,
  variantUpdateBody,
} from "../../utils/product-editor/variantEdits";
import { useProductPricingLock } from "./useProductPricingLock.hook";
import { usePriceChangeReason } from "./usePriceChangeReason.hook";
import { useVariantRows } from "./useVariantRows.hook";
import { useVariantAction } from "./useVariantAction.hook";

interface Options {
  productId: string;
  open: boolean;
  onChanged?: () => void;
}

/** Loads a product's variants and saves, adds and removes them one at a time. */
export function useProductVariantsDialog({
  productId,
  open,
  onChanged,
}: Options) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const {
    rows,
    setRows,
    newRows,
    setNewRows,
    patchExisting,
    patchNew,
    discardNew,
    addNewRow,
  } = useVariantRows();
  const [rowErrors, setRowErrors] = useState<
    Record<string, VariantDraftErrors>
  >({});
  const changeReasonField = usePriceChangeReason();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pricing = useProductPricingLock(product);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const loaded = await productsApi.detail(productId);
      setProduct(loaded);
      setRows(loaded.variants.map(draftOf));
      setNewRows([]);
      setError(null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadProduct));
    } finally {
      setLoading(false);
    }
  }, [productId, setRows, setNewRows]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  /** The reason is only asked for when the change is a price one on a product that needs it. */
  const reasonFor = (isPriceChange: boolean) =>
    pricing.reasonRequired && isPriceChange
      ? changeReasonField.take()
      : undefined;

  const { busyKey, run } = useVariantAction(setError, async () => {
    changeReasonField.reset();
    await load();
    onChanged?.();
  });

  const saveExisting = (key: string) => {
    const draft = rows.find((row) => row.key === key);
    const original = product?.variants.find((variant) => variant.id === key);
    if (!draft || !original) return;
    const errors = validateVariantEdit(draft, variantMessages(LABELS));
    setRowErrors(Object.keys(errors).length ? { [key]: errors } : {});
    if (Object.keys(errors).length) return;
    const changeReason = reasonFor(
      Number(draft.price) !== Number(original.price),
    );
    if (changeReason === null) return;
    changeReasonField.clearError();
    void run(key, () =>
      productsApi.updateVariant(
        key,
        variantUpdateBody(draft, original, changeReason),
      ),
    );
  };

  const saveNew = (key: string) => {
    const draft = newRows.find((row) => row.key === key);
    if (!draft) return;
    const errors = validateVariantDraft(draft, variantMessages(LABELS));
    if (Object.keys(errors).length) {
      setRowErrors((current) => ({ ...current, [key]: errors }));
      return;
    }
    // Adding a variant sets a price, so it counts as a price change.
    const changeReason = reasonFor(true);
    if (changeReason === null) return;
    setRowErrors({});
    changeReasonField.clearError();
    void run(key, () =>
      productsApi.addVariant(productId, {
        ...toVariantBody(draft),
        ...(changeReason ? { changeReason } : {}),
      }),
    );
  };

  const removeExisting = (key: string) =>
    void run(key, () => productsApi.deleteVariant(key));

  return {
    product,
    rows,
    newRows,
    rowErrors,
    reason: changeReasonField.value,
    reasonError: changeReasonField.error,
    handleReasonChange: changeReasonField.onChange,
    error,
    busyKey,
    loading,
    pricing,
    saveExisting,
    saveNew,
    removeExisting,
    patchExisting,
    patchNew,
    discardNew,
    addNewRow,
  };
}
