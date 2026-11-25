"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
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
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] divide-y lg:divide-y-0 lg:divide-x divide-line/80">
        <div className="lg:overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
          <BroadcastComposerControls
            state={state}
            patch={patch}
            onApplyPreset={onApplyPreset}
          />

          {error && (
            <p role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          )}
          {testNotice && (
            <p role="status" className="text-xs font-medium text-success">
              {testNotice}
            </p>
          )}
          {resultMsg && (
            <p role="status" className="text-xs font-medium text-success">
              {resultMsg}
            </p>
          )}
        </div>

        <div className="lg:overflow-hidden p-4 sm:p-5 bg-paper/20 flex flex-col">
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
      </div>

      {confirmLargeSend && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-500/30 bg-amber-500/10 px-4 sm:px-6 py-2.5 text-xs text-ink shrink-0">
          <span>
            Confirm sending to <strong>{totalRecipients}</strong> recipients via{" "}
            {state.channels.join(", ")}?
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => setConfirmLargeSend(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8"
              loading={pending}
              onClick={handlePrimaryClick}
            >
              Confirm & Send
            </Button>
          </div>
        </div>
      )}

      <div className="border-t border-line/80 bg-surface px-4 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto h-9"
        >
          <ArrowLeft className="size-4 mr-1.5" aria-hidden />
          Back to targeting
        </Button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            type="button"
            variant="outline"
            loading={pending}
            onClick={onSendTest}
            className="h-9"
          >
            Send test to me
          </Button>
          <Button
            type="button"
            loading={pending}
            onClick={handlePrimaryClick}
            className="h-9 px-5"
          >
            <Send className="size-4 mr-1.5" aria-hidden />
            {state.scheduleEnabled
              ? `Schedule for ${totalRecipients} users`
              : `Send to ${totalRecipients} users`}
          </Button>
        </div>
      </div>
    </div>
  );
}
