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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {LABELS.broadcastTitle} — Step {builder.state.step} of 2
          </DialogTitle>
          <DialogDescription>
            {builder.state.step === 1
              ? "Choose roles, specific users, smart customer segments, or vendor filters."
              : "Select delivery channels, personalize your message, preview, and schedule."}
          </DialogDescription>
        </DialogHeader>

        {builder.state.step === 1 ? (
          <BroadcastAudienceStep
            state={builder.state}
            patch={builder.patch}
            preview={builder.preview}
            previewLoading={builder.previewLoading}
            userSearchResults={builder.userSearchResults}
            onSearchUsers={builder.searchUsers}
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
      </DialogContent>
    </Dialog>
  );
}
