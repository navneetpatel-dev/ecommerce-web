"use client";

import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";

interface CodSettingsSectionProps {
  form: PlatformSettings;
  onCodEnabledChange: (value: boolean) => void;
  onCodMinOrderValueChange: (value: number) => void;
  onCodMaxOrderValueChange: (value: number | null) => void;
}

export function CodSettingsSection({
  form,
  onCodEnabledChange,
  onCodMinOrderValueChange,
  onCodMaxOrderValueChange,
}: CodSettingsSectionProps) {
  const handleEnabledChange = (value: string) =>
    onCodEnabledChange(value === "true");
  const handleMinOrderChange = (value: number | undefined) =>
    onCodMinOrderValueChange(value ?? 0);
  const handleMaxOrderChange = (value: number | undefined) =>
    onCodMaxOrderValueChange(value ?? null);

  return (
    <FormSection
      title={LABELS.settingsCod}
      hint={LABELS.settingsCodHint}
      columns={2}
    >
      <FormFieldFrame label={LABELS.settingsCodEnabled}>
        <Select
          value={form.codEnabled === false ? "false" : "true"}
          onValueChange={handleEnabledChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">{LABELS.productCodOn}</SelectItem>
            <SelectItem value="false">{LABELS.productCodOff}</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsCodMinOrder}>
        <NumberInput
          value={form.codMinOrderValue ?? 0}
          min={0}
          step={50}
          prefix={CURRENCY_SYMBOL}
          onChange={handleMinOrderChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsCodMaxOrder}>
        <NumberInput
          value={form.codMaxOrderValue ?? undefined}
          min={0}
          step={50}
          prefix={CURRENCY_SYMBOL}
          onChange={handleMaxOrderChange}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
