"use client";

import type { ChangeEvent } from "react";
import type { PlatformSettings } from "./usePlatformSettingsForm.hook";
import {
  fromLocalInputValue,
  toLocalInputValue,
} from "../../utils/settings/maintenanceTime";

interface MaintenanceSectionOptions {
  form: PlatformSettings;
  onMaintenanceEnabledChange: (value: boolean) => void;
  onMaintenanceMessageChange: (value: string) => void;
  onMaintenanceUntilChange: (value: string | null) => void;
}

/** Maps the maintenance fields to the select and inputs of the settings section (B-11). */
export function useMaintenanceSettingsSection({
  form,
  onMaintenanceEnabledChange,
  onMaintenanceMessageChange,
  onMaintenanceUntilChange,
}: MaintenanceSectionOptions) {
  const handleEnabledChange = (value: string) =>
    onMaintenanceEnabledChange(value === "true");
  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) =>
    onMaintenanceMessageChange(event.target.value);
  const handleUntilChange = (event: ChangeEvent<HTMLInputElement>) =>
    onMaintenanceUntilChange(fromLocalInputValue(event.target.value));

  return {
    enabledValue: form.maintenanceEnabled ? "true" : "false",
    untilValue: toLocalInputValue(form.maintenanceUntil),
    handleEnabledChange,
    handleMessageChange,
    handleUntilChange,
  };
}
