"use client";

import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";

interface CommerceSettingsSectionProps {
  form: PlatformSettings;
  onCommissionRateChange: (value: number) => void;
  onTcsRateChange: (value: number) => void;
  onTdsRateChange: (value: number) => void;
  onTds194oExemptionThresholdChange: (value: number) => void;
  onCommissionGstRateChange: (value: number) => void;
  onPlatformGstinChange: (value: string) => void;
  onPlatformLegalNameChange: (value: string) => void;
  onPlatformStateChange: (value: string) => void;
  onAutoApproveChange: (value: boolean) => void;
}

export function CommerceSettingsSection({
  form,
  onCommissionRateChange,
  onTcsRateChange,
  onTdsRateChange,
  onTds194oExemptionThresholdChange,
  onCommissionGstRateChange,
  onPlatformGstinChange,
  onPlatformLegalNameChange,
  onPlatformStateChange,
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
      <FormFieldFrame
        label={LABELS.tds194oExemptionThreshold}
        hint={LABELS.tds194oExemptionThresholdHint}
      >
        <NumberInput
          value={form.tds194oExemptionThreshold}
          min={0}
          step={10000}
          prefix="₹"
          onChange={(value) => onTds194oExemptionThresholdChange(value ?? 0)}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.commissionGstRatePercent}
        hint={LABELS.commissionGstRateHint}
      >
        <NumberInput
          value={form.commissionGstRatePercent ?? 18}
          min={0}
          max={100}
          step={0.5}
          suffix="%"
          onChange={(value) => onCommissionGstRateChange(value ?? 18)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.platformLegalName}>
        <Input
          value={form.platformLegalName ?? ""}
          onChange={(e) => onPlatformLegalNameChange(e.target.value)}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.platformGstin}
        hint={LABELS.platformGstinHint}
      >
        <Input
          value={form.platformGstin ?? ""}
          onChange={(e) => onPlatformGstinChange(e.target.value)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.platformState}>
        <Input
          value={form.platformState ?? ""}
          onChange={(e) => onPlatformStateChange(e.target.value)}
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
