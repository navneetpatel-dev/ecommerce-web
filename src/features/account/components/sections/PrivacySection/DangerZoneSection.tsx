"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { LABELS } from "@/shared/constants/labels";

interface DangerZoneSectionProps {
  isWorkspace: boolean;
  onDeleteClick: () => void;
}

export function DangerZoneSection({
  isWorkspace,
  onDeleteClick,
}: DangerZoneSectionProps) {
  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line px-5 py-4 md:px-6">
        <TextEyebrow>{LABELS.dangerZone}</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.1875rem] tracking-tight text-ink">
          {LABELS.deleteAccount}
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          {isWorkspace
            ? LABELS.deleteAccountHintWorkspace
            : LABELS.deleteAccountHintCustomer}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="text-[0.8125rem] leading-6 text-ink-muted">
          {LABELS.deleteAccountBody}
        </p>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="shrink-0 gap-2"
          onClick={onDeleteClick}
        >
          <Trash2 size={14} strokeWidth={1.5} />
          {LABELS.deleteAccount}
        </Button>
      </div>
    </section>
  );
}
