import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORTER_ROLE_VALUES } from "@/shared/constants/statuses";
import { BUG_REPORTER_ROLE_LABEL } from "../../utils/labels";
import { ALL } from "./useBugReportFiltersHandlers.hook";

interface BugReporterRoleFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function BugReporterRoleFilterSelect({
  value,
  onChange,
}: BugReporterRoleFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.bugFilterReporterRole}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.bugFilterAllReporterRoles} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>
            {LABELS.bugFilterAllReporterRoles}
          </SelectItem>
          {BUG_REPORTER_ROLE_VALUES.map((role) => (
            <SelectItem key={role} value={role}>
              {BUG_REPORTER_ROLE_LABEL[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
