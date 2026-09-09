import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_SEVERITY_VALUES } from "@/shared/constants/statuses";
import { BUG_SEVERITY_LABEL } from "../../../utils/detail/labels";
import { ALL } from "./useBugReportFiltersHandlers.hook";

interface BugSeverityFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function BugSeverityFilterSelect({
  value,
  onChange,
}: BugSeverityFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.bugSeverity}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.bugFilterAllSeverities} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{LABELS.bugFilterAllSeverities}</SelectItem>
          {BUG_REPORT_SEVERITY_VALUES.map((severity) => (
            <SelectItem key={severity} value={severity}>
              {BUG_SEVERITY_LABEL[severity]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
