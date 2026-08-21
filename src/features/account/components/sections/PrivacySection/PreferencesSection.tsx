"use client";

import { Download, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { LABELS } from "@/shared/constants/labels";

interface PreferencesSectionProps {
  theme: string;
  mounted: boolean;
  isWorkspace: boolean;
  isCustomer: boolean;
  exportPending: boolean;
  exportError: Error | null;
  onSetTheme: (theme: "light" | "dark") => void;
  onExport: () => void;
  onSignOutClick: () => void;
}

export function PreferencesSection({
  theme,
  mounted,
  isWorkspace,
  isCustomer,
  exportPending,
  exportError,
  onSetTheme,
  onExport,
  onSignOutClick,
}: PreferencesSectionProps) {
  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/65 px-5 py-4 md:px-6">
        <TextEyebrow>{LABELS.privacyPreferences}</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.1875rem] tracking-tight text-ink">
          {LABELS.privacyAndData}
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          {isWorkspace
            ? LABELS.privacyAndDataHintWorkspace
            : LABELS.privacyAndDataHintCustomer}
        </p>
      </div>

      <ul className="divide-y divide-line">
        <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="min-w-0">
            <p className="text-[0.9375rem] font-medium text-ink">
              {LABELS.appearance}
            </p>
            <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
              {isWorkspace
                ? LABELS.appearanceHintWorkspace
                : LABELS.appearanceHintCustomer}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant={mounted && theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => onSetTheme("light")}
            >
              {LABELS.themeLight}
            </Button>
            <Button
              type="button"
              variant={mounted && theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => onSetTheme("dark")}
            >
              {LABELS.themeDark}
            </Button>
          </div>
        </li>

        {isCustomer ? (
          <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-medium text-ink">
                {LABELS.downloadMyData}
              </p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                {LABELS.downloadMyDataHintCustomer}
              </p>
              <FormError
                error={exportError}
                fallback={LABELS.couldNotExportAccount}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              loading={exportPending}
              onClick={onExport}
            >
              <Download size={14} strokeWidth={1.5} />
              {LABELS.download}
            </Button>
          </li>
        ) : null}

        <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="min-w-0">
            <p className="text-[0.9375rem] font-medium text-ink">
              {LABELS.signOut}
            </p>
            <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
              {LABELS.signOutHint}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-2"
            onClick={onSignOutClick}
          >
            <LogOut size={14} strokeWidth={1.5} />
            {LABELS.signOut}
          </Button>
        </li>
      </ul>
    </section>
  );
}
