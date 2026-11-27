"use client";

import { Pencil } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { useAdminEditNameAction } from "../../hooks/shared/useAdminEditNameAction.hook";

interface AdminEditNameActionProps {
  currentName: string;
  title: string;
  description: string;
  fieldLabel: string;
  emptyHint: string;
  onSave: (name: string) => void | Promise<unknown>;
}

/** Classy rename action with custom dialog (replaces window.prompt). */
export function AdminEditNameAction({
  currentName,
  title,
  description,
  fieldLabel,
  emptyHint,
  onSave,
}: AdminEditNameActionProps) {
  const {
    open,
    loading,
    name,
    canSave,
    openDialog,
    close,
    handleOpenChange,
    handleNameChange,
    run,
  } = useAdminEditNameAction({ currentName, onSave });

  return (
    <>
      <RowActionButton
        kind="edit"
        icon={Pencil}
        label={LABELS.edit}
        disabled={loading}
        onClick={openDialog}
      />

      <StatusDialog
        icon={Pencil}
        open={open}
        onOpenChange={handleOpenChange}
        variant="info"
        title={title}
        description={description}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.save,
          loading,
          disabled: !canSave,
          disabledHint: !name.trim() ? emptyHint : undefined,
          onClick: run,
        }}
      >
        <FormFieldFrame
          label={fieldLabel}
          htmlFor="admin-edit-name"
          hint={!name.trim() ? emptyHint : undefined}
        >
          <Input
            id="admin-edit-name"
            value={name}
            onChange={handleNameChange}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: this control lives in a dialog/popover that opened from a user action, where moving focus into the panel is the expected behaviour
            autoFocus
            placeholder={fieldLabel}
          />
        </FormFieldFrame>
      </StatusDialog>
    </>
  );
}
