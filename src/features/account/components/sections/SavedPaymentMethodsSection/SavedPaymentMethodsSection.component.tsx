"use client";

import { paymentMethodsLabels as LABELS } from "@/shared/constants/labels/paymentMethods";
import { useSavedPaymentMethodsSection } from "./useSavedPaymentMethodsSection.hook";
import { SavedPaymentMethodsList } from "./SavedPaymentMethodsList.component";
import { SavedPaymentMethodsEmptyState } from "./SavedPaymentMethodsEmptyState.component";
import { SavedPaymentMethodsLoadingSkeleton } from "./SavedPaymentMethodsLoadingSkeleton.component";
import { DeleteSavedPaymentMethodDialog } from "./DeleteSavedPaymentMethodDialog.component";
import { savedPaymentMethodsSectionStyles as styles } from "./savedPaymentMethodsSection.styles";

export function SavedPaymentMethodsSection() {
  const {
    isLoading,
    hasMethods,
    methodViewModels,
    deleteTarget,
    isDeleting,
    listError,
    handleOpenDelete,
    handleCloseDelete,
    handleDeleteConfirmed,
  } = useSavedPaymentMethodsSection();

  if (isLoading) {
    return <SavedPaymentMethodsLoadingSkeleton />;
  }

  return (
    <div className={styles.container}>
      <p className={styles.description}>{LABELS.savedPaymentMethodsDesc}</p>

      {hasMethods ? (
        <SavedPaymentMethodsList
          methods={methodViewModels}
          onDelete={handleOpenDelete}
        />
      ) : (
        <SavedPaymentMethodsEmptyState />
      )}

      {listError && (
        <p role="alert" className={styles.listErrorNotice}>
          {listError}
        </p>
      )}

      <DeleteSavedPaymentMethodDialog
        target={deleteTarget}
        deleting={isDeleting}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
