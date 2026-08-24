"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { adminShippingApi } from "@/features/admin-dashboard/api/shipping.api";
import type { AdminDataRow } from "../hooks/useAdminDataList.hook";

interface AdminEditShippingZoneActionProps {
  row: AdminDataRow;
  onSaved: () => void;
}

function asCsv(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(", ");
  if (typeof value === "string") return value;
  return "";
}

function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function AdminEditShippingZoneAction({
  row,
  onSaved,
}: AdminEditShippingZoneActionProps) {
  const currentName = typeof row.name === "string" ? row.name : "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentName);
  const [states, setStates] = useState(asCsv(row.states));
  const [pincodePrefixes, setPincodePrefixes] = useState(
    asCsv(row.pincodePrefixes),
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const close = () => {
    if (loading) return;
    setOpen(false);
    setActionError(null);
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

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("edit")}
        disabled={loading}
        onClick={() => {
          setName(currentName);
          setStates(asCsv(row.states));
          setPincodePrefixes(asCsv(row.pincodePrefixes));
          setActionError(null);
          setOpen(true);
        }}
      >
        <Pencil strokeWidth={2.25} aria-hidden />
        <span>{LABELS.edit}</span>
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        variant="info"
        title={LABELS.editShippingZoneTitle}
        description={LABELS.editShippingZoneBody}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.save,
          loading,
          disabled: !canSave,
          disabledHint: !name.trim() ? LABELS.enterZoneName : undefined,
          onClick: () => {
            void run();
          },
        }}
      >
        <div className="space-y-3">
          <FormFieldFrame
            label={LABELS.zoneName}
            htmlFor="shipping-zone-edit-name"
            hint={!name.trim() ? LABELS.enterZoneName : undefined}
          >
            <Input
              id="shipping-zone-edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder={LABELS.zoneName}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.states}
            htmlFor="shipping-zone-edit-states"
            hint={LABELS.zoneStatesHint}
          >
            <Input
              id="shipping-zone-edit-states"
              value={states}
              onChange={(e) => setStates(e.target.value)}
              placeholder={LABELS.states}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.pincodePrefixes}
            htmlFor="shipping-zone-edit-prefixes"
            hint={LABELS.zonePincodePrefixesHint}
          >
            <Input
              id="shipping-zone-edit-prefixes"
              value={pincodePrefixes}
              onChange={(e) => setPincodePrefixes(e.target.value)}
              placeholder={LABELS.pincodePrefixes}
            />
          </FormFieldFrame>
          {actionError ? (
            <p className="text-body-sm text-danger">{actionError}</p>
          ) : null}
        </div>
      </StatusDialog>
    </>
  );
}
