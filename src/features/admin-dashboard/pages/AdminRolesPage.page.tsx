"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { RolePermissionsDialog } from "../components/RolePermissionsDialog.component";
import { useAdminRolesPage } from "../hooks/useAdminRolesPage.hook";

export function AdminRolesPage() {
  return (
    <RequirePermission permission={PERMISSIONS.ROLE_MANAGE}>
      <AdminRolesContent />
    </RequirePermission>
  );
}

function AdminRolesContent() {
  const page = useAdminRolesPage();

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

      {page.error ? (
        <p className="text-body-sm text-danger">{page.error}</p>
      ) : null}

      <TableScrollShell>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead>{LABELS.name}</TableHead>
              <TableHead>{LABELS.permissions}</TableHead>
              <TableHead>{LABELS.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="text-body">
                  <span className="font-mono">{role.name}</span>
                  {role.isSystemRole ? (
                    <Badge variant="secondary" className="ml-2">
                      {LABELS.builtInRoleBadge}
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="text-body-sm text-ink-muted">
                  {formatLabel(LABELS.permissionCount, {
                    count: role.permissionKeys.length,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => page.setEditingRoleId(role.id)}
                    >
                      {LABELS.managePermissions}
                    </Button>
                    {!role.isSystemRole ? (
                      <AdminConfirmAction
                        inline
                        label={LABELS.delete}
                        dialogVariant="danger"
                        tone="danger"
                        triggerVariant="outline"
                        triggerClassName="text-danger hover:bg-danger/10 hover:border-danger/60 border-line"
                        title={LABELS.confirmDeleteRoleTitle}
                        description={formatLabel(LABELS.confirmDeleteRoleBody, {
                          name: role.name,
                        })}
                        onConfirm={() => page.deleteRole(role.id)}
                      />
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScrollShell>

      <RolePermissionsDialog
        role={page.editingRole}
        permissions={page.permissions}
        onClose={() => page.setEditingRoleId(null)}
        onSave={page.savePermissions}
      />
    </div>
  );
}
