"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
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
            autoFocus
            placeholder={fieldLabel}
          />
        </FormFieldFrame>
      </StatusDialog>
    </>
  );
}
