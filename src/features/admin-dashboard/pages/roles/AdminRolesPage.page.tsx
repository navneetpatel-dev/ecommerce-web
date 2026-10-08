"use client";

import type { ChangeEvent } from "react";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { TableRowAction } from "@/shared/components/DataTable/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { RolePermissionsDialog } from "../../components/roles/RolePermissionsDialog/index";
import { useAdminRolesPage } from "../../hooks/roles/useAdminRolesPage.hook";
import type { AdminRole } from "../../api/roles/roles.api";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminRolesPage() {
  return (
    <RequirePermission permission={PERMISSIONS.ROLE_MANAGE}>
      <AdminRolesContent />
    </RequirePermission>
  );
}

function AdminRolesContent() {
  const page = useAdminRolesPage();

  const handleNewRoleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    page.setNewRoleName(event.target.value);
  const handleCreateRole = () => {
    void page.createRole();
  };
  const closePermissions = () => page.setEditingRoleId(null);

  const columns: DataTableColumn<AdminRole>[] = [
    {
      id: "name",
      header: LABELS.name,
      cell: (role) => {
        const builtInBadge = role.isSystemRole ? (
          <Badge variant="secondary">{LABELS.builtInRoleBadge}</Badge>
        ) : null;
        return (
          <div className={adminPagesStyles.flexGap2}>
            <span className={adminPagesStyles.fontMono}>{role.name}</span>
            {builtInBadge}
          </div>
        );
      },
    },
    {
      id: "permissions",
      header: LABELS.permissions,
      className: adminPagesStyles.hint,
      cell: (role) =>
        formatLabel(LABELS.permissionCount, {
          count: role.permissionKeys.length,
        }),
    },
  ];

  const renderRoleActions = (role: AdminRole) => {
    const deleteRole = () => page.deleteRole(role.id);
    const editRole = () => page.setEditingRoleId(role.id);

    const deleteAction = !role.isSystemRole ? (
      <TableRowAction destructive>
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          tone="danger"
          title={LABELS.confirmDeleteRoleTitle}
          description={formatLabel(LABELS.confirmDeleteRoleBody, {
            name: role.name,
          })}
          onConfirm={deleteRole}
        />
      </TableRowAction>
    ) : null;

    return (
      <>
        <TableRowAction>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={tableMenuButtonClass("edit")}
            onClick={editRole}
          >
            <ShieldCheck strokeWidth={2.25} aria-hidden />
            <span>{LABELS.managePermissions}</span>
          </Button>
        </TableRowAction>
        {deleteAction}
      </>
    );
  };

  return (
    <div className={adminPagesStyles.stack5}>
      <div>
        <h1 className={adminPagesStyles.pageHeading}>{LABELS.roles}</h1>
        <p className={adminPagesStyles.hintMuted}>{LABELS.rolesHint}</p>
      </div>

      <div className={adminPagesStyles.flexWrapGap2}>
        <Input
          value={page.newRoleName}
          onChange={handleNewRoleNameChange}
          placeholder={LABELS.newRoleNamePlaceholder}
          className={adminPagesStyles.inputMaxXs}
        />
        <Button
          type="button"
          disabled={page.creating || !page.newRoleName.trim()}
          onClick={handleCreateRole}
        >
          {LABELS.createRole}
        </Button>
      </div>

      <DataTable
        ariaLabel={LABELS.rolesTableAria}

        columns={columns}
        rows={page.roles}
        loading={page.loading}
        error={page.error}
        emptyMessage={LABELS.noRecordsFound}
        getRowId={(role) => role.id}
        rowDetails={false}
        actions={renderRoleActions}
      />

      <RolePermissionsDialog
        role={page.editingRole}
        permissions={page.permissions}
        onClose={closePermissions}
        onSave={page.savePermissions}
      />
    </div>
  );
}
