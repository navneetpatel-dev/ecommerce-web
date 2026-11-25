"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { BroadcastBuilderState } from "../../hooks/notifications/broadcastBuilder.types";
import { BroadcastComposerControls } from "./BroadcastComposerControls.component";
import { BroadcastPreviewPane } from "./BroadcastPreviewPane.component";

interface BroadcastComposerStepProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
  totalRecipients: number;
  renderPreview: { subject: string; html: string } | null;
  previewTheme: "light" | "dark";
  onThemeChange: (t: "light" | "dark") => void;
  onApplyPreset: (id: string) => void;
  onBack: () => void;
  onSendTest: () => void;
  onSubmit: () => void;
  pending: boolean;
  error: string | null;
  testNotice: string | null;
  resultMsg: string | null;
}

export function BroadcastComposerStep({
  state,
  patch,
  totalRecipients,
  renderPreview,
  previewTheme,
  onThemeChange,
  onApplyPreset,
  onBack,
  onSendTest,
  onSubmit,
  pending,
  error,
  testNotice,
  resultMsg,
}: BroadcastComposerStepProps) {
  const [confirmLargeSend, setConfirmLargeSend] = useState(false);

  const handlePrimaryClick = () => {
    if (totalRecipients > 50 && !confirmLargeSend) {
      setConfirmLargeSend(true);
      return;
    }
    setConfirmLargeSend(false);
    onSubmit();
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6">
        <BroadcastComposerControls
          state={state}
          patch={patch}
          onApplyPreset={onApplyPreset}
        />

        <BroadcastPreviewPane
          subject={state.subject}
          message={state.message}
          ctaLabel={state.ctaEnabled ? state.ctaLabel : undefined}
          channels={state.channels}
          renderPreview={renderPreview}
          previewTheme={previewTheme}
          onThemeChange={onThemeChange}
        />
      </div>

      {error && (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      )}
      {testNotice && (
        <p role="status" className="text-body-sm text-success">
          {testNotice}
        </p>
      )}
      {resultMsg && (
        <p role="status" className="text-body-sm text-success">
          {resultMsg}
        </p>
      )}

      {confirmLargeSend && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-body-xs text-ink">
          <span>
            Confirm sending to <strong>{totalRecipients}</strong> recipients via{" "}
            {state.channels.join(", ")}?
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setConfirmLargeSend(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              loading={pending}
              onClick={handlePrimaryClick}
            >
              Confirm & Send
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back to targeting
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            loading={pending}
            onClick={onSendTest}
          >
            Send test to me
          </Button>
          <Button type="button" loading={pending} onClick={handlePrimaryClick}>
            <Send className="size-4" aria-hidden />
            {state.scheduleEnabled
              ? `Schedule for ${totalRecipients} users`
              : `Send to ${totalRecipients} users`}
          </Button>
        </div>
      </div>
    </div>
  );
}
