"use client";

import { useMemo, useState } from "react";
import { CreditCard, Smartphone } from "lucide-react";
import { paymentMethodsLabels as LABELS } from "@/shared/constants/labels/paymentMethods";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  useSavedPaymentMethods,
  useDeleteSavedPaymentMethod,
} from "../../../api/payment-methods/savedPaymentMethods.queries";
import type { SavedPaymentMethod } from "../../../types/layout/types";

export interface SavedPaymentMethodViewModel {
  id: string;
  icon: typeof CreditCard;
  title: string;
  subtitle: string;
  isDeleting: boolean;
  raw: SavedPaymentMethod;
}

function describeMethod(method: SavedPaymentMethod): {
  icon: typeof CreditCard;
  title: string;
  subtitle: string;
} {
  if (method.methodType === "upi" || method.vpa) {
    return {
      icon: Smartphone,
      title: LABELS.upiMethodLabel,
      subtitle: method.vpa ?? "",
    };
  }
  const network = method.cardNetwork ?? LABELS.cardMethodLabel;
  const last4 = method.cardLast4 ? `•••• ${method.cardLast4}` : "";
  return { icon: CreditCard, title: network, subtitle: last4 };
}

export function useSavedPaymentMethodsSection() {
  const { data: methods, isLoading } = useSavedPaymentMethods();
  const deleteMethod = useDeleteSavedPaymentMethod();

  const [deleteTarget, setDeleteTarget] = useState<SavedPaymentMethod | null>(
    null,
  );
  const [listError, setListError] = useState<string | null>(null);

  const list = useMemo(() => methods ?? [], [methods]);

  const methodViewModels = useMemo<SavedPaymentMethodViewModel[]>(() => {
    return list.map((method) => {
      const { icon, title, subtitle } = describeMethod(method);
      return {
        id: method.id,
        icon,
        title,
        subtitle,
        isDeleting: deleteMethod.isPending && deleteTarget?.id === method.id,
        raw: method,
      };
    });
  }, [list, deleteMethod.isPending, deleteTarget?.id]);

  const handleOpenDelete = (method: SavedPaymentMethod) => {
    setDeleteTarget(method);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setListError(null);
    try {
      await deleteMethod.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteTarget(null);
      setListError(
        getApiErrorMessage(err, LABELS.couldNotDeleteSavedPaymentMethod),
      );
    }
  };

  return {
    isLoading,
    hasMethods: methodViewModels.length > 0,
    methodViewModels,
    deleteTarget,
    isDeleting: deleteMethod.isPending,
    listError,
    handleOpenDelete,
    handleCloseDelete,
    handleDeleteConfirmed,
  };
}
