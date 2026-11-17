"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";

interface AutoApproveFieldProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

/** An on/off "auto-approve" switch shown as the Enabled / Disabled (moderated) select. */
export function AutoApproveField({
  label,
  hint,
  value,
  onChange,
}: AutoApproveFieldProps) {
  return (
    <FormFieldFrame label={label} hint={hint}>
      <Select
        value={value ? "true" : "false"}
        onValueChange={(next) => onChange(next === "true")}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">{LABELS.autoApproveEnabled}</SelectItem>
          <SelectItem value="false">{LABELS.autoApproveDisabled}</SelectItem>
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
