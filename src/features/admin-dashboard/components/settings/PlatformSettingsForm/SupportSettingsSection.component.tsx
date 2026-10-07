"use client";

import type { ChangeEvent } from "react";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";

interface SupportSettingsSectionProps {
  form: PlatformSettings;
  onSupportEmailChange: (value: string) => void;
  onSupportHoursChange: (value: string) => void;
  onTicketReopenWindowDaysChange: (value: number) => void;
  onBugVerifyWindowDaysChange: (value: number) => void;
  onBugCloseWindowDaysChange: (value: number) => void;
}

export function SupportSettingsSection({
  form,
  onSupportEmailChange,
  onSupportHoursChange,
  onTicketReopenWindowDaysChange,
  onBugVerifyWindowDaysChange,
  onBugCloseWindowDaysChange,
}: SupportSettingsSectionProps) {
  const handleSupportEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSupportEmailChange(event.target.value);
  };

  const handleSupportHoursChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSupportHoursChange(event.target.value);
  };

  const handleTicketReopenWindowDaysChange = (value: number | undefined) => {
    onTicketReopenWindowDaysChange(value ?? 7);
  };

  const handleBugVerifyWindowDaysChange = (value: number | undefined) => {
    onBugVerifyWindowDaysChange(value ?? 7);
  };

  const handleBugCloseWindowDaysChange = (value: number | undefined) => {
    onBugCloseWindowDaysChange(value ?? 7);
  };

  return (
    <FormSection
      title={LABELS.settingsSupport}
      hint={LABELS.settingsSupportHint}
      columns={2}
    >
      <FormFieldFrame
        label={LABELS.supportEmail}
        htmlFor="platform-support-email"
      >
        <Input
          id="platform-support-email"
          type="email"
          autoComplete="off"
          value={form.supportEmail}
          onChange={handleSupportEmailChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.supportHours}
        htmlFor="platform-support-hours"
      >
        <Input
          id="platform-support-hours"
          value={form.supportHours}
          onChange={handleSupportHoursChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.ticketReopenWindowDays}
        hint={LABELS.ticketReopenWindowDaysHint}
      >
        <NumberInput
          value={form.ticketReopenWindowDays ?? 7}
          min={1}
          max={365}
          step={1}
          suffix={LABELS.daysShort}
          onChange={handleTicketReopenWindowDaysChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.bugVerifyWindowDays}
        hint={LABELS.bugVerifyWindowDaysHint}
      >
        <NumberInput
          value={form.bugVerifyWindowDays ?? 7}
          min={1}
          max={365}
          step={1}
          suffix={LABELS.daysShort}
          onChange={handleBugVerifyWindowDaysChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.bugCloseWindowDays}
        hint={LABELS.bugCloseWindowDaysHint}
      >
        <NumberInput
          value={form.bugCloseWindowDays ?? 7}
          min={1}
          max={365}
          step={1}
          suffix={LABELS.daysShort}
          onChange={handleBugCloseWindowDaysChange}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
