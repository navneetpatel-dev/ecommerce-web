"use client";

import { ShieldCheck } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { AdminRole, AdminPermission } from "../../api/roles.api";
import { PermissionsList } from "./PermissionsList.component";
import { PermissionsToolbar } from "./PermissionsToolbar.component";
import { useRolePermissionsDialog } from "./useRolePermissionsDialog.hook";
import { rolePermissionsDialogStyles as styles } from "./rolePermissionsDialog.styles";

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
  const {
    selected,
    search,
    setSearch,
    saving,
    error,
    filteredPermissions,
    toggle,
    selectVisible,
    clearVisible,
    handleOpenChange,
    handleResetSearch,
    submit,
  } = useRolePermissionsDialog({ role, permissions, onClose, onSave });

  const roleTag = role ? (
    <span className={styles.roleTag}>{role.name}</span>
  ) : null;

  const systemBadge = role?.isSystemRole ? (
    <Badge variant="secondary" className={styles.systemBadge}>
      {LABELS.builtInRoleBadge}
    </Badge>
  ) : null;

  const errorMessage = error ? (
    <p className={styles.errorMessage}>{error}</p>
  ) : null;

  return (
    <Dialog open={Boolean(role)} onOpenChange={handleOpenChange}>
      <DialogContent className={styles.dialogContent}>
        {/* Header with Title, Badges, and Live Counter */}
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.titleWrapper}>
              <ShieldCheck className={styles.shieldIcon} aria-hidden />
              <h2 className={styles.title}>{LABELS.managePermissions}</h2>
            </div>
            <span className={styles.counterBadge}>
              {selected.size} / {permissions.length} selected
            </span>
          </div>

          <div className={styles.roleMetaRow}>
            <span>Permissions for</span>
            {roleTag}
            {systemBadge}
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
        <div className={styles.scrollArea}>
          {errorMessage}

          <PermissionsList
            permissions={filteredPermissions}
            selected={selected}
            onToggle={toggle}
            onResetSearch={handleResetSearch}
          />
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <span className={styles.footerCount}>
            {formatLabel(LABELS.permissionCount, { count: selected.size })}{" "}
            enabled
          </span>
          <div className={styles.footerActions}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={onClose}
            >
              {LABELS.cancel}
            </Button>
            <Button type="button" size="sm" loading={saving} onClick={submit}>
              {LABELS.savePermissions}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
