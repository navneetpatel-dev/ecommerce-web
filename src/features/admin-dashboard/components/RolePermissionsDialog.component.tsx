"use client";

import { useEffect, useState } from "react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { AdminRole, AdminPermission } from "../api/roles.api";

interface RolePermissionsDialogProps {
  role: AdminRole | null;
  permissions: AdminPermission[];
  onClose: () => void;
  onSave: (roleId: string, permissionKeys: string[]) => Promise<void>;
}

export function RolePermissionsDialog({
  role,
  permissions,
  onClose,
  onSave,
}: RolePermissionsDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(new Set(role?.permissionKeys ?? []));
  }, [role]);

  const toggle = (key: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const submit = async () => {
    if (!role) return;
    setSaving(true);
    try {
      await onSave(role.id, [...selected]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <StatusDialog
      open={Boolean(role)}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      variant="info"
      title={
        role
          ? formatLabel(LABELS.managePermissionsFor, { name: role.name })
          : ""
      }
      description=""
      secondaryAction={{
        label: LABELS.cancel,
        disabled: saving,
        onClick: onClose,
      }}
      primaryAction={{
        label: LABELS.savePermissions,
        loading: saving,
        onClick: () => void submit(),
      }}
    >
      <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto">
        {permissions.map((permission) => (
          <CheckboxField
            key={permission.id}
            id={`role-perm-${permission.id}`}
            checked={selected.has(permission.key)}
            onCheckedChange={(checked) => toggle(permission.key, checked)}
            label={permission.key}
          />
        ))}
      </div>
    </StatusDialog>
  );
}
