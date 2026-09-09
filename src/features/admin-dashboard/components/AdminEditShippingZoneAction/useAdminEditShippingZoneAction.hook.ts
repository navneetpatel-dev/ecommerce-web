"use client";

import { useState, type ChangeEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { adminShippingApi } from "@/features/admin-dashboard/api/shipping.api";
import type { AdminDataRow } from "../../hooks/useAdminDataList.hook";
import { asCsv, parseCsv } from "../../utils/csvField";

interface UseAdminEditShippingZoneActionParams {
  row: AdminDataRow;
  onSaved: () => void;
}

export function useAdminEditShippingZoneAction({
  row,
  onSaved,
}: UseAdminEditShippingZoneActionParams) {
  const currentName = typeof row.name === "string" ? row.name : "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentName);
  const [states, setStates] = useState(asCsv(row.states));
  const [pincodePrefixes, setPincodePrefixes] = useState(
    asCsv(row.pincodePrefixes),
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const openDialog = () => {
    setName(currentName);
    setStates(asCsv(row.states));
    setPincodePrefixes(asCsv(row.pincodePrefixes));
    setActionError(null);
    setOpen(true);
  };

  const close = () => {
    if (loading) return;
    setOpen(false);
    setActionError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) close();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleStatesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStates(e.target.value);
  };

  const handlePincodePrefixesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPincodePrefixes(e.target.value);
  };

  const canSave = Boolean(name.trim());

  const run = async () => {
    const nextName = name.trim();
    if (!nextName) return;
    setLoading(true);
    setActionError(null);
    try {
      await adminShippingApi.updateZone(String(row.id), {
        name: nextName,
        states: parseCsv(states),
        pincodePrefixes: parseCsv(pincodePrefixes),
      });
      setOpen(false);
      onSaved();
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setLoading(false);
    }
  };

  return {
    open,
    loading,
    name,
    states,
    pincodePrefixes,
    actionError,
    canSave,
    openDialog,
    close,
    handleOpenChange,
    handleNameChange,
    handleStatesChange,
    handlePincodePrefixesChange,
    run,
  };
}
