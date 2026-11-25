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
      <DialogContent className="w-[95vw] max-w-6xl sm:max-w-6xl h-[88vh] max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="border-b border-line px-6 py-4 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
            <div>
              <DialogTitle>{LABELS.broadcastTitle}</DialogTitle>
              <DialogDescription className="mt-0.5">
                {builder.state.step === 1
                  ? "Choose roles, specific users, smart customer segments, or vendor filters."
                  : "Select delivery channels, personalize your message, preview, and schedule."}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 text-caption">
              {(
                [
                  { step: 1, label: "1. Audience & Targeting" },
                  { step: 2, label: "2. Message & Delivery" },
                ] as const
              ).map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => builder.patch({ step: item.step })}
                  className={cn(
                    "rounded-full border px-3 py-1 font-medium transition-colors cursor-pointer",
                    builder.state.step === item.step
                      ? "border-brand bg-brand/15 text-brand"
                      : "border-line text-ink-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
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
