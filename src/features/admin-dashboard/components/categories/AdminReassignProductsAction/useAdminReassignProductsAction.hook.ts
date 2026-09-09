"use client";

import { useState } from "react";
import { useReassignProducts } from "../../../hooks/categories/useReassignProducts.hook";

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

  const beginReassign = () => {
    setOpen(true);
    clearFeedback();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  const handleSubmit = () => {
    void onSubmit();
  };

  const canSubmit =
    !loading && Boolean(fromId) && Boolean(toId) && fromId !== toId;

  return {
    open,
    categories,
    fromId,
    setFromId,
    toId,
    setToId,
    error,
    message,
    loading,
    canSubmit,
    beginReassign,
    handleOpenChange,
    handleSubmit,
  };
}
