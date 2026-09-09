import { CheckSquare, Search, Square, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { rolePermissionsDialogStyles } from "../../../styles/roles/rolePermissionsDialog.styles";

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
    <div className={rolePermissionsDialogStyles.toolbarRoot}>
      <div className={rolePermissionsDialogStyles.searchWrap}>
        <Search className={rolePermissionsDialogStyles.searchIcon} />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search permissions..."
          className={rolePermissionsDialogStyles.searchInput}
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className={rolePermissionsDialogStyles.clearIconBtn}
            aria-label="Clear search"
          >
            <X className={rolePermissionsDialogStyles.iconXs} />
          </button>
        ) : null}
      </div>

      <div className={rolePermissionsDialogStyles.toolbarActions}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSelectVisible}
          className={rolePermissionsDialogStyles.actionBtn}
        >
          <CheckSquare className={rolePermissionsDialogStyles.iconXsBrand} />
          Select all
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearVisible}
          disabled={clearDisabled}
          className={rolePermissionsDialogStyles.actionBtnMuted}
        >
          <Square className={rolePermissionsDialogStyles.iconXsMuted} />
          Clear all
        </Button>
      </div>
    </div>
  );
}
