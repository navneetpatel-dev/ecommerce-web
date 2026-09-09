import { SelectItem } from "@/shared/components/ui/select";
import { USER_STATUS } from "@/shared/constants/statuses";
import { adminUsersFiltersLabels } from "@/shared/constants/labels/adminUsersFilters";

const ALL_STATUSES_VALUE = "__all_statuses__";
const USER_STATUS_OPTIONS = Object.values(USER_STATUS);

export function UserStatusOptionsList() {
  return (
    <>
      <SelectItem value={ALL_STATUSES_VALUE}>
        {adminUsersFiltersLabels.usersAllStatuses}
      </SelectItem>
      {USER_STATUS_OPTIONS.map((value) => (
        <SelectItem key={value} value={value}>
          {value.replace(/_/g, " ")}
        </SelectItem>
      ))}
    </>
  );
}

export { ALL_STATUSES_VALUE };
