import type { ChangeEvent } from "react";
import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { CheckSquare, Search, Square } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
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
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className={rolePermissionsDialogStyles.toolbarRoot}>
      <div className={rolePermissionsDialogStyles.searchWrap}>
        <Search className={rolePermissionsDialogStyles.searchIcon} />
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder={LABELS.searchPermissionsPlaceholder}
          className={rolePermissionsDialogStyles.searchInput}
        />
        {search ? (
          <IconCloseButton
            variant="inline"
            label={LABELS.clearPermissionSearch}
            className={rolePermissionsDialogStyles.clearIconBtn}
            onClick={handleClearSearch}
          />
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
          {LABELS.selectAllVisible}
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
          {LABELS.clearAllVisible}
        </Button>
      </div>
    </div>
  );
}
