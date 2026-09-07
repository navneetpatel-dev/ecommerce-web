"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Search, ShieldCheck, Square, X } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
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
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search permissions..."
                className="pl-9 pr-8 h-9 text-body-sm bg-surface border-line"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectVisible}
                className="h-9 gap-1.5 text-xs font-medium"
              >
                <CheckSquare className="size-3.5 text-brand" />
                Select all
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearVisible}
                disabled={selected.size === 0}
                className="h-9 gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                <Square className="size-3.5 text-ink-muted" />
                Clear all
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Permissions Card Grid */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {error ? (
            <p className="mb-4 text-body-sm text-danger">{error}</p>
          ) : null}

          {filteredPermissions.length === 0 ? (
            <div className="py-12 text-center rounded-md border border-dashed border-line bg-surface/40">
              <p className="text-body font-medium text-ink-muted">
                No permissions match your search
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="mt-2 text-brand text-xs"
              >
                Reset search
              </Button>
            </div>
          ) : (
            <TooltipProvider delayDuration={150}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredPermissions.map((permission) => {
                  const isChecked = selected.has(permission.key);
                  const moduleName =
                    permission.key.split(".")[0]?.replace(/_/g, " ") ?? "other";

                  return (
                    <Tooltip key={permission.id}>
                      <TooltipTrigger asChild>
                        <label
                          className={cn(
                            "group flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer select-none",
                            isChecked
                              ? "border-brand bg-brand-subtle/30 text-ink shadow-xs ring-1 ring-brand/20"
                              : "border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-raised",
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggle(permission.key)}
                            />
                            <span
                              className={cn(
                                "truncate text-body-sm font-mono",
                                isChecked
                                  ? "font-semibold text-ink"
                                  : "font-normal text-ink",
                              )}
                            >
                              {permission.key}
                            </span>
                          </div>
                          <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider text-ink-faint group-hover:text-ink-muted">
                            {moduleName}
                          </span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="font-mono text-xs max-w-xs break-all"
                      >
                        {permission.key}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          )}
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
