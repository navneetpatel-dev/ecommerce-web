"use client";

import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";
import { ADMIN_NOTE_LIMITS } from "../../constants/listing-form/productFields";
import { productsApi } from "../../api/listing/products.api";
import {
  emptyVariantDraft,
  formatVariantOptions,
  parseVariantOptions,
  toVariantBody,
  validateVariantDraft,
  variantMessages,
  type VariantDraft,
  type VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import { useProductPricingLock } from "./useProductPricingLock.hook";

const MIN_REASON = ADMIN_NOTE_LIMITS.MIN;

const draftOf = (variant: ProductVariant): VariantDraft => ({
  key: variant.id,
  sku: variant.sku,
  price: String(variant.price),
  stock: String(variant.stock),
  options: formatVariantOptions(variant.attributes),
});

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
  const [rows, setRows] = useState<VariantDraft[]>([]);
  const [newRows, setNewRows] = useState<VariantDraft[]>([]);
  const [rowErrors, setRowErrors] = useState<
    Record<string, VariantDraftErrors>
  >({});
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
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
  }, [productId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  /** The reason is only asked for when the change is a price one on a product that needs it. */
  const reasonFor = (isPriceChange: boolean): string | undefined | null => {
    if (!pricing.reasonRequired || !isPriceChange) return undefined;
    const text = reason.trim();
    if (text.length < MIN_REASON) {
      setReasonError(LABELS.priceChangeReasonRequired);
      return null;
    }
    return text;
  };

  const run = async (key: string, action: () => Promise<unknown>) => {
    setBusyKey(key);
    setError(null);
    try {
      await action();
      notifySuccess(LABELS.variantSaved);
      setReason("");
      await load();
      onChanged?.();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveVariant));
    } finally {
      setBusyKey(null);
    }
  };

  const saveExisting = (key: string) => {
    const draft = rows.find((row) => row.key === key);
    const original = product?.variants.find((variant) => variant.id === key);
    if (!draft || !original) return;
    const priceChanged = Number(draft.price) !== Number(original.price);
    const changeReason = reasonFor(priceChanged);
    if (changeReason === null) return;
    setReasonError(undefined);
    void run(key, () =>
      productsApi.updateVariant(key, {
        attributes: parseVariantOptions(draft.options),
        stock: toVariantBody(draft).stock,
        ...(priceChanged ? { price: Number(draft.price) } : {}),
        ...(changeReason ? { changeReason } : {}),
      }),
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
    setReasonError(undefined);
    void run(key, () =>
      productsApi.addVariant(productId, {
        ...toVariantBody(draft),
        ...(changeReason ? { changeReason } : {}),
      }),
    );
  };

  const removeExisting = (key: string) =>
    void run(key, () => productsApi.deleteVariant(key));

  const patchExisting = (key: string, patch: Partial<VariantDraft>) =>
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  const patchNew = (key: string, patch: Partial<VariantDraft>) =>
    setNewRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  const discardNew = (key: string) =>
    setNewRows((current) => current.filter((row) => row.key !== key));
  const addNewRow = () =>
    setNewRows((current) => [...current, emptyVariantDraft()]);
  const handleReasonChange = (value: string) => {
    setReason(value);
    setReasonError(undefined);
  };

  return {
    product,
    rows,
    newRows,
    rowErrors,
    reason,
    reasonError,
    handleReasonChange,
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
