"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ShieldCheck } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { TableRowAction } from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { RolePermissionsDialog } from "../components/RolePermissionsDialog";
import { useAdminRolesPage } from "../hooks/useAdminRolesPage.hook";
import type { AdminRole } from "../api/roles.api";

export function AdminRolesPage() {
  return (
    <RequirePermission permission={PERMISSIONS.ROLE_MANAGE}>
      <AdminRolesContent />
    </RequirePermission>
  );
}

function AdminRolesContent() {
  const page = useAdminRolesPage();

  const columns: DataTableColumn<AdminRole>[] = [
    {
      id: "name",
      header: LABELS.name,
      cell: (role) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">{role.name}</span>
          {role.isSystemRole ? (
            <Badge variant="secondary">{LABELS.builtInRoleBadge}</Badge>
          ) : null}
        </div>
      ),
    },
    {
      id: "permissions",
      header: LABELS.permissions,
      className: "text-body-sm text-ink-muted",
      cell: (role) =>
        formatLabel(LABELS.permissionCount, {
          count: role.permissionKeys.length,
        }),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">
          {LABELS.roles}
        </h1>
        <p className="mt-1 text-body-sm text-ink-muted">{LABELS.rolesHint}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          value={page.newRoleName}
          onChange={(e) => page.setNewRoleName(e.target.value)}
          placeholder={LABELS.newRoleNamePlaceholder}
          className="max-w-xs"
        />
        <Button
          type="button"
          disabled={page.creating || !page.newRoleName.trim()}
          onClick={() => void page.createRole()}
        >
          {LABELS.createRole}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={page.roles}
        loading={page.loading}
        error={page.error}
        emptyMessage={LABELS.noRecordsFound}
        getRowId={(role) => role.id}
        rowDetails={false}
        actions={(role) => (
          <>
            <TableRowAction>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={tableMenuButtonClass("edit")}
                onClick={() => page.setEditingRoleId(role.id)}
              >
                <ShieldCheck strokeWidth={2.25} aria-hidden />
                <span>{LABELS.managePermissions}</span>
              </Button>
            </TableRowAction>
            {!role.isSystemRole ? (
              <TableRowAction destructive>
                <AdminConfirmAction
                  label={LABELS.delete}
                  dialogVariant="danger"
                  tone="danger"
                  title={LABELS.confirmDeleteRoleTitle}
                  description={formatLabel(LABELS.confirmDeleteRoleBody, {
                    name: role.name,
                  })}
                  onConfirm={() => page.deleteRole(role.id)}
                />
              </TableRowAction>
            ) : null}
          </>
        )}
      />

      <RolePermissionsDialog
        role={page.editingRole}
        permissions={page.permissions}
        onClose={() => page.setEditingRoleId(null)}
        onSave={page.savePermissions}
      />
    </div>
  );
}
