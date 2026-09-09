"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { AdminRole, AdminPermission } from "../../api/roles.api";
import { PermissionsList } from "./PermissionsList.component";
import { PermissionsToolbar } from "./PermissionsToolbar.component";

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
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelected(new Set(role?.permissionKeys ?? []));
    setSearch("");
    setError(null);
  }, [role]);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredPermissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return permissions;
    return permissions.filter((p) => {
      const mod = p.key.split(".")[0]?.toLowerCase() ?? "";
      return p.key.toLowerCase().includes(q) || mod.includes(q);
    });
  }, [permissions, search]);

  const selectVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => next.add(p.key));
      return next;
    });
  };

  const clearVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => next.delete(p.key));
      return next;
    });
  };

  const submit = async () => {
    if (!role) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(role.id, [...selected]);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={Boolean(role)}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="w-full sm:max-w-3xl max-h-[min(90vh,46rem)] h-[min(90vh,46rem)] p-0 sm:p-0 flex flex-col overflow-hidden gap-0">
        {/* Header with Title, Badges, and Live Counter */}
        <div className="border-b border-line px-6 py-4 bg-paper/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-brand shrink-0" aria-hidden />
              <h2 className="text-h3 font-semibold text-ink">
                {LABELS.managePermissions}
              </h2>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-semibold text-brand tabular-nums">
              {selected.size} / {permissions.length} selected
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-body-sm text-ink-muted">
            <span>Permissions for</span>
            {role ? (
              <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-surface border border-line text-ink font-semibold">
                {role.name}
              </span>
            ) : null}
            {role?.isSystemRole ? (
              <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
                {LABELS.builtInRoleBadge}
              </Badge>
            ) : null}
          </div>

          {/* Search & Bulk Actions Toolbar */}
          <PermissionsToolbar
            search={search}
            onSearchChange={setSearch}
            onSelectVisible={selectVisible}
            onClearVisible={clearVisible}
            clearDisabled={selected.size === 0}
          />
        </div>

        {/* Scrollable Permissions Card Grid */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {error ? (
            <p className="mb-4 text-body-sm text-danger">{error}</p>
          ) : null}

          <PermissionsList
            permissions={filteredPermissions}
            selected={selected}
            onToggle={toggle}
            onResetSearch={() => setSearch("")}
          />
        </div>

        {/* Modal Footer */}
        <div className="border-t border-line px-6 py-4 bg-paper/50 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-body-sm text-ink-muted">
            {formatLabel(LABELS.permissionCount, { count: selected.size })}{" "}
            enabled
          </span>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={onClose}
            >
              {LABELS.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              loading={saving}
              onClick={() => void submit()}
            >
              {LABELS.savePermissions}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
