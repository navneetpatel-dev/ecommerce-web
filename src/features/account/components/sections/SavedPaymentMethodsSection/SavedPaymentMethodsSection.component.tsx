"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { paymentMethodsLabels as LABELS } from "@/shared/constants/labels/paymentMethods";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  useSavedPaymentMethods,
  useDeleteSavedPaymentMethod,
} from "../../../api/savedPaymentMethods.queries";
import type { SavedPaymentMethod } from "../../../types";
import { SavedPaymentMethodCard } from "./SavedPaymentMethodCard.component";
import { DeleteSavedPaymentMethodDialog } from "./DeleteSavedPaymentMethodDialog.component";

export function SavedPaymentMethodsSection() {
  const { data: methods, isLoading } = useSavedPaymentMethods();
  const deleteMethod = useDeleteSavedPaymentMethod();

  const [deleteTarget, setDeleteTarget] = useState<SavedPaymentMethod | null>(
    null,
  );
  const [listError, setListError] = useState<string | null>(null);

  const list = methods ?? [];

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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-[0.875rem] text-ink-muted">
        {LABELS.savedPaymentMethodsDesc}
      </p>

      {list.length === 0 ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={CreditCard}
            heading={LABELS.noSavedPaymentMethodsHeading}
            message={LABELS.noSavedPaymentMethodsMessage}
            className="py-12 md:py-14"
          />
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((method) => (
            <SavedPaymentMethodCard
              key={method.id}
              method={method}
              deleting={
                deleteMethod.isPending && deleteTarget?.id === method.id
              }
              onDelete={setDeleteTarget}
            />
          ))}
        </ul>
      )}

      {listError ? (
        <p role="alert" className="text-[0.875rem] text-danger">
          {listError}
        </p>
      ) : null}

      <DeleteSavedPaymentMethodDialog
        target={deleteTarget}
        deleting={deleteMethod.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteConfirmed()}
      />
    </div>
  );
}
