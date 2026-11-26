"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type AdminBroadcastRecord,
} from "../../api/notifications/notifications.api";

interface SendTestConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broadcast?: AdminBroadcastRecord | null;
  onSuccess?: (message: string) => void;
}

export function SendTestConfirmDialog({
  open,
  onOpenChange,
  broadcast,
  onSuccess,
}: SendTestConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSend = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (broadcast) {
        const res = await notificationsApi.sendBroadcastRecordTest(
          broadcast.id,
        );
        const msg = `Test broadcast sent to ${res.sentTo}.`;
        setSuccessMsg(msg);
        onSuccess?.(msg);
      } else {
        await notificationsApi.sendTest();
        const msg = "Test WELCOME notification queued for your admin account.";
        setSuccessMsg(msg);
        onSuccess?.(msg);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send test notification."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (submitting) return;
        if (!next) {
          setError(null);
          setSuccessMsg(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {broadcast ? "Send test of broadcast" : "Send test email"}
          </DialogTitle>
          <DialogDescription>
            Confirm what will happen before queuing this test notification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-line bg-paper/55 divide-y divide-line/50 px-3.5">
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Recipient</span>
              <span className="font-medium text-ink">
                Your signed-in admin account only
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Type / Subject</span>
              <span className="font-mono text-ink text-right truncate max-w-[16rem]">
                {broadcast ? `[Test] ${broadcast.subject}` : "WELCOME (sample)"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Channels</span>
              <span className="font-mono text-ink">
                {broadcast ? broadcast.channels.join(" · ") : "EMAIL"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Side effect</span>
              <span className="text-ink text-right">
                Logs a NotificationLog row via BullMQ
              </span>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          ) : null}
          {successMsg ? (
            <p
              role="status"
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              {successMsg}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-line pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              {successMsg ? "Done" : "Cancel"}
            </Button>
            {!successMsg && (
              <Button type="button" loading={submitting} onClick={handleSend}>
                <Send className="size-3.5" aria-hidden />
                Confirm & Send test
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
