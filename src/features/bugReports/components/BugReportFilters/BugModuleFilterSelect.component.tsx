import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { BUG_AFFECTED_MODULE_VALUES } from "@/shared/constants/statuses";
import { BUG_MODULE_LABEL } from "../../utils/labels";
import { ALL } from "./useBugReportFiltersHandlers.hook";

interface BugModuleFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function BugModuleFilterSelect({
  value,
  onChange,
}: BugModuleFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.bugAffectedModule}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.bugFilterAllModules} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{LABELS.bugFilterAllModules}</SelectItem>
          {BUG_AFFECTED_MODULE_VALUES.map((mod) => (
            <SelectItem key={mod} value={mod}>
              {BUG_MODULE_LABEL[mod]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
