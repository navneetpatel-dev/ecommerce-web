import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";
import type { AdminPermission } from "../../../api/roles/roles.api";
import { rolePermissionsDialogStyles } from "../../../styles/roles/rolePermissionsDialog.styles";

interface PermissionsListProps {
  permissions: AdminPermission[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  onResetSearch: () => void;
}

/** Scrollable grid of permission checkboxes with a per-item hover tooltip. */
export function PermissionsList({
  permissions,
  selected,
  onToggle,
  onResetSearch,
}: PermissionsListProps) {
  if (permissions.length === 0) {
    return (
      <div className={rolePermissionsDialogStyles.emptyContainer}>
        <p className={rolePermissionsDialogStyles.emptyText}>
          No permissions match your search
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetSearch}
          className={rolePermissionsDialogStyles.clearSearchBtn}
        >
          Reset search
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className={rolePermissionsDialogStyles.gridSm2}>
        {permissions.map((permission) => {
          const isChecked = selected.has(permission.key);
          const moduleName =
            permission.key.split(".")[0]?.replace(/_/g, " ") ?? "other";

          return (
            <Tooltip key={permission.id}>
              <TooltipTrigger asChild>
                <label
                  className={cn(
                    rolePermissionsDialogStyles.itemLabelBase,
                    isChecked
                      ? rolePermissionsDialogStyles.itemLabelChecked
                      : rolePermissionsDialogStyles.itemLabelUnchecked,
                  )}
                >
                  <div className={rolePermissionsDialogStyles.itemLabelRow}>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggle(permission.key)}
                    />
                    <span
                      className={cn(
                        rolePermissionsDialogStyles.itemKeyText,
                        isChecked
                          ? rolePermissionsDialogStyles.itemKeyChecked
                          : rolePermissionsDialogStyles.itemKeyUnchecked,
                      )}
                    >
                      {permission.key}
                    </span>
                  </div>
                  <span className={rolePermissionsDialogStyles.itemScopeText}>
                    {moduleName}
                  </span>
                </label>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className={rolePermissionsDialogStyles.tooltipContent}
              >
                {permission.key}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
