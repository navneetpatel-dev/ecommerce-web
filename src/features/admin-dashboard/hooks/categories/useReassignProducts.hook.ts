"use client";

import { useEffect, useState } from "react";
import { MAX_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { categoriesApi } from "@/features/categories";
import type { Category } from "@/shared/api/types";

/**
 * Owns category loading and product-reassignment mutation state for the
 * reassign action (Rule 1/12: fetching lives in hooks, not components).
 */
export function useReassignProducts(open: boolean, onDone: () => void) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    void categoriesApi
      .listPaginated({ page: 1, limit: MAX_PAGE_LIMIT })
      .then((result) => {
        setCategories(result.items);
      });
  }, [open]);

  const onSubmit = async () => {
    if (!fromId || !toId || fromId === toId) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await categoriesApi.reassignProducts(fromId, toId);
      setMessage(
        formatLabel(LABELS.productsReassigned, {
          count: String(result.updatedCount),
        }),
      );
      onDone();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotReassignProducts));
    } finally {
      setLoading(false);
    }
  };

  const clearFeedback = () => {
    setError(null);
    setMessage(null);
  };

  return {
    categories,
    fromId,
    setFromId,
    toId,
    setToId,
    error,
    message,
    loading,
    onSubmit,
    clearFeedback,
  };
}
