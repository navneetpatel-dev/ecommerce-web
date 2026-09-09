"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AddressFormDialog } from "@/shared/components/AddressFormDialog.component";
import { AddressCardsList } from "./AddressCardsList.component";
import { AddressesEmptyState } from "./AddressesEmptyState.component";
import { AddressesLoadingSkeleton } from "./AddressesLoadingSkeleton.component";
import { DeleteAddressDialog } from "./DeleteAddressDialog.component";
import { useAddressesSection } from "../../../hooks/addresses/useAddressesSection.hook";
import { addressesSectionStyles as styles } from "../../../styles/addresses/addressesSection.styles";

export function AddressesSection() {
  const {
    list,
    isLoading,
    hasAddresses,
    saving,
    dialogOpen,
    editing,
    deleteTarget,
    isDeleting,
    listError,
    defaultingId,
    isSettingDefault,
    summaryText,
    handleOpenCreate,
    handleOpenEdit,
    handleSetDefault,
    handleDeleteTarget,
    handleDeleteConfirmed,
    handleCloseDeleteDialog,
    handleDialogChange,
    handleFormSubmit,
  } = useAddressesSection();

  if (isLoading) {
    return <AddressesLoadingSkeleton />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <p className={styles.summaryText}>{summaryText}</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenCreate}
          className={styles.headerAddButton}
        >
          <Plus size={16} />
          Add address
        </Button>
      </div>

      {hasAddresses ? (
        <AddressCardsList
          addresses={list}
          defaultingId={defaultingId}
          isSettingDefault={isSettingDefault}
          onEdit={handleOpenEdit}
          onSetDefault={handleSetDefault}
          onDelete={handleDeleteTarget}
          onAddAddress={handleOpenCreate}
        />
      ) : (
        <AddressesEmptyState onAddAddress={handleOpenCreate} />
      )}

      {listError && (
        <p role="alert" className={styles.listErrorNotice}>
          {listError}
        </p>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        address={editing}
        hasAddresses={hasAddresses}
        isPending={saving}
        onSubmit={handleFormSubmit}
      />

      <DeleteAddressDialog
        target={deleteTarget}
        deleting={isDeleting}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
