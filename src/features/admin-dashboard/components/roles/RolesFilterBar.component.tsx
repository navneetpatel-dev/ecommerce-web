import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";

interface RolesFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleType: string;
  onRoleTypeChange: (val: string) => void;
  onClear: () => void;
}

export function RolesFilterBar({
  search,
  onSearchChange,
  roleType,
  onRoleTypeChange,
  onClear,
}: RolesFilterBarProps) {
  const activeCount = (search.trim() ? 1 : 0) + (roleType ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        <FormFieldFrame label={LABELS.search} htmlFor="roles-filter-search">
          <Input
            id="roles-filter-search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles by name..."
          />
        </FormFieldFrame>

        <FormFieldFrame label="Role Type" htmlFor="roles-filter-type">
          <Select
            value={roleType || "__ALL__"}
            onValueChange={(val) =>
              onRoleTypeChange(val === "__ALL__" ? "" : val)
            }
          >
            <SelectTrigger id="roles-filter-type">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">All Roles</SelectItem>
              <SelectItem value="system">Built-in Roles</SelectItem>
              <SelectItem value="custom">Custom Roles</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
