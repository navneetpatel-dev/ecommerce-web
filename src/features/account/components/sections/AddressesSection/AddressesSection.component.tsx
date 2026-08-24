"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import type { Address, AddressInput } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AddressFormDialog } from "@/shared/components/AddressFormDialog.component";
import { LABELS } from "@/shared/constants/labels";
import {
  useAccountAddresses,
  useCreateAccountAddress,
  useUpdateAccountAddress,
  useDeleteAccountAddress,
  useSetDefaultAccountAddress,
} from "../../../api/account.queries";
import { AddressCard } from "./AddressCard.component";
import { DeleteAddressDialog } from "./DeleteAddressDialog.component";

export function AddressesSection() {
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

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
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
      setListError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Could not set default address.",
      );
    } finally {
      setDefaultingId(null);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setListError(null);
    try {
      await deleteAddress.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteTarget(null);
      setListError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Could not delete address.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.875rem] text-ink-muted">
          {hasAddresses
            ? `${list.length} saved ${list.length === 1 ? "address" : "addresses"}`
            : "No addresses yet"}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={openCreate}
          className="gap-2"
        >
          <Plus size={16} />
          Add address
        </Button>
      </div>

      {!hasAddresses ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={MapPin}
            heading="Add a delivery address"
            message="Save where orders should arrive so checkout stays quick."
            actionLabel="Add address"
            onAction={openCreate}
            className="py-12 md:py-14"
          />
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              defaulting={defaultingId === addr.id && setDefault.isPending}
              onEdit={openEdit}
              onSetDefault={handleSetDefault}
              onDelete={setDeleteTarget}
            />
          ))}
          <li>
            <Button
              type="button"
              variant="outline"
              onClick={openCreate}
              className="h-full min-h-[10rem] max-h-none w-full flex-col gap-2 border-dashed border-line bg-paper/40 p-4 text-ink-muted hover:border-ink/30 hover:bg-paper hover:text-ink"
            >
              <Plus size={20} strokeWidth={1.5} />
              <span className="text-[0.875rem] font-medium">
                {LABELS.addAddress}
              </span>
            </Button>
          </li>
        </ul>
      )}

      {listError ? (
        <p role="alert" className="text-[0.875rem] text-danger">
          {listError}
        </p>
      ) : null}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editing}
        hasAddresses={hasAddresses}
        isPending={saving}
        onSubmit={async (body: AddressInput) => {
          if (editing) {
            await updateAddress.mutateAsync({ addressId: editing.id, body });
            return;
          }
          await createAddress.mutateAsync(body);
        }}
      />

      <DeleteAddressDialog
        target={deleteTarget}
        deleting={deleteAddress.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteConfirmed()}
      />
    </div>
  );
}
