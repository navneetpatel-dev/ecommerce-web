"use client";

import { useState } from "react";
import { useReassignProducts } from "./useReassignProducts.hook";
import { useCategoryRateImpact } from "./useCategoryRateImpact.hook";

interface UseAdminReassignProductsActionParams {
  onDone: () => void;
}

export function useAdminReassignProductsAction({
  onDone,
}: UseAdminReassignProductsActionParams) {
  const [open, setOpen] = useState(false);
  const reassign = useReassignProducts(open, onDone);
  const {
    categories,
    categoriesLoading,
    fromId,
    setFromId,
    toId,
    setToId,
    error,
    message,
    loading,
    onSubmit,
    clearFeedback,
  } = reassign;

  const rates = useCategoryRateImpact(
    open && fromId && toId && fromId !== toId
      ? { kind: "reassign", fromCategoryId: fromId, toCategoryId: toId }
      : null,
  );

  const beginReassign = () => {
    setOpen(true);
    clearFeedback();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  const handleSubmit = () => {
    const reason = rates.takeReason();
    if (reason !== null) void onSubmit(reason);
  };

  const canSubmit =
    !loading &&
    !rates.checking &&
    !rates.blocked &&
    Boolean(fromId) &&
    Boolean(toId) &&
    fromId !== toId;

  return {
    open,
    categories,
    categoriesLoading,
    fromId,
    setFromId,
    toId,
    setToId,
    error,
    message,
    loading,
    canSubmit,
    rates,
    beginReassign,
    handleOpenChange,
    handleSubmit,
  };
}
