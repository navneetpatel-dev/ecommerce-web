"use client";

import { useState } from "react";
import type { Address, AddressInput } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  useAccountAddresses,
  useCreateAccountAddress,
  useUpdateAccountAddress,
  useDeleteAccountAddress,
  useSetDefaultAccountAddress,
} from "../../api/addresses/account.queries";

export function useAddressesSection() {
  const { data: addresses, isLoading } = useAccountAddresses();
  const createAddress = useCreateAccountAddress();
  const updateAddress = useUpdateAccountAddress();
  const deleteAddress = useDeleteAccountAddress();
  const setDefault = useSetDefaultAccountAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);

  const list = addresses ?? [];
  const hasAddresses = list.length > 0;
  const saving = createAddress.isPending || updateAddress.isPending;

  const handleOpenCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditing(addr);
    setDialogOpen(true);
  };

  const handleSetDefault = async (addr: Address) => {
    if (addr.isDefault) return;
    setListError(null);
    setDefaultingId(addr.id);
    try {
      await setDefault.mutateAsync(addr.id);
    } catch (err) {
      setListError(getApiErrorMessage(err, LABELS.couldNotSaveAddress));
    } finally {
      setDefaultingId(null);
    }
  };

  const handleDeleteTarget = (addr: Address) => {
    setDeleteTarget(addr);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setListError(null);
    try {
      await deleteAddress.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteTarget(null);
      setListError(getApiErrorMessage(err, LABELS.couldNotSaveAddress));
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const handleFormSubmit = async (body: AddressInput) => {
    if (editing) {
      await updateAddress.mutateAsync({ addressId: editing.id, body });
      return;
    }
    await createAddress.mutateAsync(body);
  };

  const addressCountLabel = list.length === 1 ? "address" : "addresses";
  const summaryText = hasAddresses
    ? `${list.length} saved ${addressCountLabel}`
    : "No addresses yet";

  return {
    list,
    isLoading,
    hasAddresses,
    saving,
    dialogOpen,
    editing,
    deleteTarget,
    isDeleting: deleteAddress.isPending,
    listError,
    defaultingId,
    isSettingDefault: setDefault.isPending,
    summaryText,
    handleOpenCreate,
    handleOpenEdit,
    handleSetDefault,
    handleDeleteTarget,
    handleDeleteConfirmed,
    handleCloseDeleteDialog,
    handleDialogChange,
    handleFormSubmit,
  };
}
