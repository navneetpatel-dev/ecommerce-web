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
import type { PlatformSettings } from "../hooks/usePlatformSettingsForm.hook";

interface WalletPointsSettingsSectionProps {
  form: PlatformSettings;
  onWalletRechargeEnabledChange: (value: boolean) => void;
  onWalletMinRechargeChange: (value: number) => void;
  onWalletMaxRechargeChange: (value: number) => void;
  onWalletMaxBalanceChange: (value: number) => void;
  onWalletRechargePresetsChange: (value: number[]) => void;
  onPointsPerRupeeChange: (value: number) => void;
}

export function WalletPointsSettingsSection({
  form,
  onWalletRechargeEnabledChange,
  onWalletMinRechargeChange,
  onWalletMaxRechargeChange,
  onWalletMaxBalanceChange,
  onWalletRechargePresetsChange,
  onPointsPerRupeeChange,
}: WalletPointsSettingsSectionProps) {
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
          onValueChange={(value) => onWalletRechargeEnabledChange(value === "true")}
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
      <FormFieldFrame label={LABELS.settingsPointsPerRupee}>
        <NumberInput
          value={form.pointsPerRupee ?? 1}
          min={0.01}
          step={0.01}
          onChange={(value) => onPointsPerRupeeChange(value ?? 1)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsWalletMinRecharge}>
        <NumberInput
          value={form.walletMinRechargeInr ?? 100}
          min={1}
          step={50}
          prefix="₹"
          onChange={(value) => onWalletMinRechargeChange(value ?? 100)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsWalletMaxRecharge}>
        <NumberInput
          value={form.walletMaxRechargeInr ?? 10000}
          min={1}
          step={100}
          prefix="₹"
          onChange={(value) => onWalletMaxRechargeChange(value ?? 10000)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.settingsWalletMaxBalance}>
        <NumberInput
          value={form.walletMaxBalancePoints ?? 50000}
          min={0}
          step={500}
          onChange={(value) => onWalletMaxBalanceChange(value ?? 50000)}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.settingsWalletRechargePresets}
        hint={LABELS.settingsWalletRechargePresetsHint}
      >
        <Input
          value={presetsText}
          onChange={(event) => {
            const parsed = event.target.value
              .split(",")
              .map((part) => Number(part.trim()))
              .filter((n) => Number.isFinite(n) && n > 0);
            onWalletRechargePresetsChange(parsed);
          }}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
