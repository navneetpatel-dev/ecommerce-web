"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import type { AdminDataRow } from "../hooks/useAdminDataList.hook";
import { useAdminEditShippingZoneAction } from "./AdminEditShippingZoneAction/useAdminEditShippingZoneAction.hook";
import { adminEditShippingZoneActionStyles as styles } from "./AdminEditShippingZoneAction/adminEditShippingZoneAction.styles";

interface AdminEditShippingZoneActionProps {
  row: AdminDataRow;
  onSaved: () => void;
}

export function AdminEditShippingZoneAction({
  row,
  onSaved,
}: AdminEditShippingZoneActionProps) {
  const {
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
  } = useAdminEditShippingZoneAction({ row, onSaved });

  const errorMessage = actionError ? (
    <p className={styles.errorMessage}>{actionError}</p>
  ) : null;

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("edit")}
        disabled={loading}
        onClick={openDialog}
      >
        <Pencil strokeWidth={2.25} aria-hidden />
        <span>{LABELS.edit}</span>
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={handleOpenChange}
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
          onClick: run,
        }}
      >
        <div className={styles.container}>
          <FormFieldFrame
            label={LABELS.zoneName}
            htmlFor="shipping-zone-edit-name"
            hint={!name.trim() ? LABELS.enterZoneName : undefined}
          >
            <Input
              id="shipping-zone-edit-name"
              value={name}
              onChange={handleNameChange}
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
              onChange={handleStatesChange}
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
              onChange={handlePincodePrefixesChange}
              placeholder={LABELS.pincodePrefixes}
            />
          </FormFieldFrame>
          {errorMessage}
        </div>
      </StatusDialog>
    </>
  );
}
