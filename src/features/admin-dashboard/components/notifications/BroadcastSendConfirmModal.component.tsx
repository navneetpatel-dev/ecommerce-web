"use client";

import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { BroadcastBuilderState } from "../../hooks/notifications/broadcastBuilder.types";

interface BroadcastSendConfirmModalProps {
  mode: "test" | "broadcast" | null;
  onClose: () => void;
  state: BroadcastBuilderState;
  totalRecipients: number;
  pending: boolean;
  onConfirm: () => void;
}

export function BroadcastSendConfirmModal({
  mode,
  onClose,
  state,
  totalRecipients,
  pending,
  onConfirm,
}: BroadcastSendConfirmModalProps) {
  const isTest = mode === "test";
  const isScheduled = !isTest && state.scheduleEnabled;

  return (
    <Dialog
      open={mode != null}
      onOpenChange={(v) => !v && !pending && onClose()}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isTest
              ? "Confirm test broadcast"
              : isScheduled
                ? "Confirm scheduled broadcast"
                : "Confirm broadcast send"}
          </DialogTitle>
          <DialogDescription>
            {isTest
              ? "This will send a [Test] copy only to your signed-in admin account."
              : "Please verify the audience, channels, and subject before queuing."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-line bg-paper/55 divide-y divide-line/50 px-3.5">
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Target</span>
              <span className="font-semibold text-ink">
                {isTest
                  ? "Your admin account (1 recipient)"
                  : `${totalRecipients} estimated recipients`}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Channels</span>
              <span className="font-mono text-ink">
                {state.channels.join(" · ")}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Classification</span>
              <span className="capitalize text-ink">
                {state.classification}
              </span>
            </div>
            {isScheduled && (
              <div className="flex justify-between gap-4 py-2">
                <span className="text-ink-muted">Scheduled for</span>
                <span className="font-mono text-ink">
                  {state.scheduledAt || "Not set"}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4 py-2">
              <span className="text-ink-muted">Subject</span>
              <span className="text-ink text-right truncate max-w-[16rem]">
                {state.subject.trim() || "—"}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-line pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="button" loading={pending} onClick={onConfirm}>
              <Send className="size-3.5" aria-hidden />
              {isTest
                ? "Send test to me"
                : isScheduled
                  ? "Confirm & Schedule"
                  : "Confirm & Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
