import { useCallback, useId } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  NotificationFilterOptionsList,
  ALL,
} from "./NotificationFilterOptionsList.component";

interface NotificationFilterSelectProps {
  label: string;
  placeholder: string;
  value: string | undefined;
  options: readonly string[];
  onChange: (value: string | undefined) => void;
}

export function NotificationFilterSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: NotificationFilterSelectProps) {
  const selectId = useId();
  const handleValueChange = useCallback(
    (next: string) => {
      onChange(next === ALL ? undefined : next);
    },
    [onChange],
  );

  return (
    <FormFieldFrame label={label} htmlFor={selectId}>
      <Select value={value ?? ALL} onValueChange={handleValueChange}>
        <SelectTrigger id={selectId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <NotificationFilterOptionsList
            placeholder={placeholder}
            options={options}
          />
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
