"use client";

import { NumberInput } from "@/shared/components/NumberInput";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../hooks/usePlatformSettingsForm";

interface CommerceSettingsSectionProps {
  form: PlatformSettings;
  onCommissionRateChange: (value: number) => void;
  onTcsRateChange: (value: number) => void;
  onTdsRateChange: (value: number) => void;
  onAutoApproveChange: (value: boolean) => void;
}

export function CommerceSettingsSection({
  form,
  onCommissionRateChange,
  onTcsRateChange,
  onTdsRateChange,
  onAutoApproveChange,
}: CommerceSettingsSectionProps) {
  return (
    <FormSection
      title={LABELS.settingsCommerce}
      hint={LABELS.settingsCommerceHint}
      columns={3}
    >
      <FormFieldFrame label={LABELS.defaultCommissionRate}>
        <NumberInput
          value={form.defaultCommissionRate}
          min={0}
          max={100}
          step={0.5}
          suffix="%"
          onChange={(value) => onCommissionRateChange(value ?? 0)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.tcsRatePercent} hint={LABELS.tcsRateHint}>
        <NumberInput
          value={form.tcsRatePercent}
          min={0}
          max={100}
          step={0.1}
          suffix="%"
          onChange={(value) => onTcsRateChange(value ?? 0)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.tdsRatePercent} hint={LABELS.tdsRateHint}>
        <NumberInput
          value={form.tdsRatePercent}
          min={0}
          max={100}
          step={0.1}
          suffix="%"
          onChange={(value) => onTdsRateChange(value ?? 0)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.autoApproveProducts}>
        <Select
          value={form.autoApproveProducts ? "true" : "false"}
          onValueChange={(value) => onAutoApproveChange(value === "true")}
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
    </FormSection>
  );
}
