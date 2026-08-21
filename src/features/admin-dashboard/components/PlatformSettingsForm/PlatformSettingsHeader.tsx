"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface PlatformSettingsHeaderProps {
  onSave: () => void;
}

export function PlatformSettingsHeader({
  onSave,
}: PlatformSettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1.5">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.platformSettings}
        </h2>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
          {LABELS.platformSettingsHint}
        </p>
      </div>
      <Button
        type="button"
        className="hidden shrink-0 sm:inline-flex"
        onClick={onSave}
      >
        {LABELS.saveSettings}
      </Button>
    </div>
  );
}
