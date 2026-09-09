import { CheckSquare, Search, Square, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface PermissionsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSelectVisible: () => void;
  onClearVisible: () => void;
  clearDisabled: boolean;
}

/** Search box + select-all/clear-all bulk actions for the permissions grid. */
export function PermissionsToolbar({
  search,
  onSearchChange,
  onSelectVisible,
  onClearVisible,
  clearDisabled,
}: PermissionsToolbarProps) {
  return (
    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search permissions..."
          className="pl-9 pr-8 h-9 text-body-sm bg-surface border-line"
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
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
          onClick={onSelectVisible}
          className="h-9 gap-1.5 text-xs font-medium"
        >
          <CheckSquare className="size-3.5 text-brand" />
          Select all
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearVisible}
          disabled={clearDisabled}
          className="h-9 gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
        >
          <Square className="size-3.5 text-ink-muted" />
          Clear all
        </Button>
      </div>
    </div>
  );
}
