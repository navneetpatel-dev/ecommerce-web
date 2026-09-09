import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import type { AdminPermission } from "../../api/roles.api";

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
      <div className="py-12 text-center rounded-md border border-dashed border-line bg-surface/40">
        <p className="text-body font-medium text-ink-muted">
          No permissions match your search
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetSearch}
          className="mt-2 text-brand text-xs"
        >
          Reset search
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {permissions.map((permission) => {
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
                      onCheckedChange={() => onToggle(permission.key)}
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
  );
}
