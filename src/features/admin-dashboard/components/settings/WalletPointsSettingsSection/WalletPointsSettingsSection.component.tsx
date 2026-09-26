"use client";

import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";
import { useWalletPointsSettingsHandlers } from "../../../hooks/settings/useWalletPointsSettingsHandlers.hook";

export interface WalletPointsSettingsSectionProps {
  form: PlatformSettings;
  onWalletRechargeEnabledChange: (value: boolean) => void;
  onWalletMinRechargeChange: (value: number) => void;
  onWalletMaxRechargeChange: (value: number) => void;
  onWalletMaxBalanceChange: (value: number) => void;
  onWalletRechargePresetsChange: (value: number[]) => void;
  onPromotionalPointsTtlDaysChange: (value: number) => void;
}

export function WalletPointsSettingsSection({
  form,
  onWalletRechargeEnabledChange,
  onWalletMinRechargeChange,
  onWalletMaxRechargeChange,
  onWalletMaxBalanceChange,
  onWalletRechargePresetsChange,
  onPromotionalPointsTtlDaysChange,
}: WalletPointsSettingsSectionProps) {
  const {
    handleRechargeEnabledChange,
    handleMinRechargeChange,
    handleMaxRechargeChange,
    handleMaxBalanceChange,
    handlePresetsChange,
    handlePromotionalTtlChange,
  } = useWalletPointsSettingsHandlers({
    onWalletRechargeEnabledChange,
    onWalletMinRechargeChange,
    onWalletMaxRechargeChange,
    onWalletMaxBalanceChange,
    onWalletRechargePresetsChange,
    onPromotionalPointsTtlDaysChange,
  });

  const presetsText = (form.walletRechargePresetsInr ?? []).join(", ");

  return (
    <FormSection
      title={LABELS.settingsWalletPoints}
      hint={LABELS.settingsWalletPointsHint}
      columns={2}
    >
      <FormFieldFrame label={LABELS.settingsWalletRechargeEnabled}>
        <Select
          value={form.walletRechargeEnabled === false ? "false" : "true"}
          onValueChange={handleRechargeEnabledChange}
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
      <FormFieldFrame label={LABELS.settingsWalletMinRecharge}>
        <NumberInput
          value={form.walletMinRechargeInr ?? 1}
          min={1}
          step={50}
          prefix="₹"
          onChange={handleMinRechargeChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsWalletMaxRecharge}>
        <NumberInput
          value={form.walletMaxRechargeInr ?? 10000}
          min={1}
          step={100}
          prefix="₹"
          onChange={handleMaxRechargeChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsWalletMaxBalance}>
        <NumberInput
          value={form.walletMaxBalancePoints ?? 50000}
          min={0}
          step={500}
          onChange={handleMaxBalanceChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.settingsWalletRechargePresets}
        hint={LABELS.settingsWalletRechargePresetsHint}
      >
        <Input value={presetsText} onChange={handlePresetsChange} />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.promotionalPointsTtlDays}
        hint={LABELS.promotionalPointsTtlDaysHint}
      >
        <NumberInput
          value={form.promotionalPointsTtlDays ?? 0}
          min={0}
          step={1}
          suffix={LABELS.daysShort}
          onChange={handlePromotionalTtlChange}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
