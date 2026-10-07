"use client";

import type { ChangeEvent } from "react";
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
import { useScheduledReportsCatalog } from "../../../hooks/settings/useScheduledReportsCatalog.hook";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";
import { ScheduledReportsTypeSelector } from "./ScheduledReportsTypeSelector.component";
import { platformSettingsFormStyles as styles } from "../../../styles/settings/platformSettingsForm.styles";

interface ScheduledReportsSettingsSectionProps {
  form: PlatformSettings;
  onScheduledReportsEnabledChange: (value: boolean) => void;
  onScheduledReportsTypesChange: (value: string[]) => void;
  onScheduledReportsRecipientsChange: (value: string[]) => void;
  onScheduledReportsDayOfWeekChange: (value: number) => void;
  onScheduledReportsHourUtcChange: (value: number) => void;
}

const HOURS_UTC = Array.from({ length: 24 }, (_, hour) => hour);

const WEEKDAY_LABELS = [
  LABELS.scheduledReportsSunday,
  LABELS.scheduledReportsMonday,
  LABELS.scheduledReportsTuesday,
  LABELS.scheduledReportsWednesday,
  LABELS.scheduledReportsThursday,
  LABELS.scheduledReportsFriday,
  LABELS.scheduledReportsSaturday,
];

export function ScheduledReportsSettingsSection({
  form,
  onScheduledReportsEnabledChange,
  onScheduledReportsTypesChange,
  onScheduledReportsRecipientsChange,
  onScheduledReportsDayOfWeekChange,
  onScheduledReportsHourUtcChange,
}: ScheduledReportsSettingsSectionProps) {
  const catalog = useScheduledReportsCatalog();
  const selectedTypes = form.scheduledReportsTypes ?? [];
  const recipientsText = (form.scheduledReportsRecipients ?? []).join(", ");

  const handleEnabledChange = (value: string) => {
    onScheduledReportsEnabledChange(value === "true");
  };

  const handleDayOfWeekChange = (value: string) => {
    onScheduledReportsDayOfWeekChange(Number(value));
  };

  const handleHourUtcChange = (value: string) => {
    onScheduledReportsHourUtcChange(Number(value));
  };

  const handleRecipientsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = event.target.value
      .split(",")
      .map((part) => part.trim())
      .filter((email) => email.length > 0);
    onScheduledReportsRecipientsChange(parsed);
  };

  return (
    <FormSection
      title={LABELS.settingsScheduledReports}
      hint={LABELS.settingsScheduledReportsHint}
      columns={2}
    >
      <FormFieldFrame label={LABELS.scheduledReportsEnabled}>
        <Select
          value={form.scheduledReportsEnabled ? "true" : "false"}
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
      <FormFieldFrame label={LABELS.scheduledReportsDayOfWeek}>
        <Select
          value={String(form.scheduledReportsDayOfWeek ?? 1)}
          onValueChange={handleDayOfWeekChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEKDAY_LABELS.map((day, index) => (
              <SelectItem key={day} value={String(index)}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.scheduledReportsHourUtc}>
        <Select
          value={String(form.scheduledReportsHourUtc ?? 6)}
          onValueChange={handleHourUtcChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HOURS_UTC.map((hour) => (
              <SelectItem key={hour} value={String(hour)}>
                {`${String(hour).padStart(2, "0")}:00`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.scheduledReportsRecipients}
        hint={LABELS.scheduledReportsRecipientsHint}
      >
        <Input
          value={recipientsText}
          placeholder={LABELS.scheduledReportsRecipientsPlaceholder}
          onChange={handleRecipientsChange}
        />
      </FormFieldFrame>
      <div className={styles.typeSelectorWrapper}>
        <ScheduledReportsTypeSelector
          catalog={catalog}
          selectedTypes={selectedTypes}
          onChange={onScheduledReportsTypesChange}
        />
      </div>
    </FormSection>
  );
}
