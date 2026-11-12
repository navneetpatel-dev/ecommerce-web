"use client";

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
import { useMaintenanceSettingsSection } from "../../../hooks/settings/useMaintenanceSettingsSection.hook";

interface MaintenanceSettingsSectionProps {
  form: PlatformSettings;
  onMaintenanceEnabledChange: (value: boolean) => void;
  onMaintenanceMessageChange: (value: string) => void;
  onMaintenanceUntilChange: (value: string | null) => void;
}

export function MaintenanceSettingsSection({
  form,
  onMaintenanceEnabledChange,
  onMaintenanceMessageChange,
  onMaintenanceUntilChange,
}: MaintenanceSettingsSectionProps) {
  const section = useMaintenanceSettingsSection({
    form,
    onMaintenanceEnabledChange,
    onMaintenanceMessageChange,
    onMaintenanceUntilChange,
  });

  return (
    <FormSection
      title={LABELS.settingsMaintenance}
      hint={LABELS.settingsMaintenanceHint}
      columns={2}
    >
      <FormFieldFrame label={LABELS.settingsMaintenanceEnabled}>
        <Select
          value={section.enabledValue}
          onValueChange={section.handleEnabledChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">
              {LABELS.settingsMaintenanceOff}
            </SelectItem>
            <SelectItem value="true">{LABELS.settingsMaintenanceOn}</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.settingsMaintenanceUntil}
        htmlFor="platform-maintenance-until"
      >
        <Input
          id="platform-maintenance-until"
          type="datetime-local"
          value={section.untilValue}
          onChange={section.handleUntilChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.settingsMaintenanceMessage}
        htmlFor="platform-maintenance-message"
      >
        <Input
          id="platform-maintenance-message"
          maxLength={500}
          placeholder={LABELS.settingsMaintenanceMessagePlaceholder}
          value={form.maintenanceMessage ?? ""}
          onChange={section.handleMessageChange}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
