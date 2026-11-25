"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import { cn } from "@/shared/utils/dom/cn";
import type { AdminBroadcastRecord } from "../../api/notifications/notifications.api";
import { useBroadcastBuilder } from "../../hooks/notifications/useBroadcastBuilder.hook";
import { BroadcastAudienceStep } from "./BroadcastAudienceStep.component";
import { BroadcastComposerStep } from "./BroadcastComposerStep.component";

interface BroadcastNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateRecord?: AdminBroadcastRecord | null;
  onSuccess?: () => void;
}

export function BroadcastNotificationDialog({
  open,
  onOpenChange,
  duplicateRecord,
  onSuccess,
}: BroadcastNotificationDialogProps) {
  const builder = useBroadcastBuilder(onSuccess);

  useEffect(() => {
    if (open && duplicateRecord) {
      builder.duplicateFrom(duplicateRecord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, duplicateRecord]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen sm:w-[96vw] max-w-7xl sm:max-w-7xl h-[100dvh] sm:h-[90vh] max-h-[100dvh] sm:max-h-[90vh] rounded-none sm:rounded-2xl flex flex-col p-0 gap-0 overflow-hidden bg-surface">
        <DialogHeader className="border-b border-line/80 px-4 sm:px-6 py-3.5 shrink-0 bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-8">
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight">
                {LABELS.broadcastTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-muted mt-0.5">
                {builder.state.step === 1
                  ? "Configure audience rules, exclusions, and verify live recipient counts."
                  : "Select channels, personalize your message, and preview across formats."}
              </DialogDescription>
            </div>

            <div className="inline-flex items-center rounded-lg border border-line bg-paper p-0.5 self-start sm:self-auto">
              {(
                [
                  { step: 1, label: "1. Audience" },
                  { step: 2, label: "2. Compose & Preview" },
                ] as const
              ).map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => builder.patch({ step: item.step })}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    builder.state.step === item.step
                      ? "bg-brand text-paper shadow-xs"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
          {builder.state.step === 1 ? (
            <BroadcastAudienceStep
              state={builder.state}
              patch={builder.patch}
              preview={builder.preview}
              previewLoading={builder.previewLoading}
              onLoadMoreSamples={builder.loadMoreSamples}
              sampleLoadingMore={builder.sampleLoadingMore}
              error={builder.error}
              onNext={() => builder.patch({ step: 2 })}
            />
          ) : (
            <BroadcastComposerStep
              state={builder.state}
              patch={builder.patch}
              totalRecipients={builder.preview?.total ?? 0}
              renderPreview={builder.renderPreview}
              previewTheme={builder.previewTheme}
              onThemeChange={builder.setPreviewTheme}
              onApplyPreset={builder.applyPreset}
              onBack={() => builder.patch({ step: 1 })}
              onSendTest={builder.sendTest}
              onSubmit={builder.submit}
              pending={builder.pending}
              error={builder.error}
              testNotice={builder.testNotice}
              resultMsg={builder.resultMsg}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
