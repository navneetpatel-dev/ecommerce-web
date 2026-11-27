"use client";

import { Send } from "lucide-react";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
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

  const title = isTest
    ? "Confirm test broadcast"
    : isScheduled
      ? "Confirm scheduled broadcast"
      : "Confirm broadcast send";
  const confirmLabel = isTest
    ? "Send test to me"
    : isScheduled
      ? "Confirm & Schedule"
      : "Confirm & Send";
  const handleOpenChange = (next: boolean) => {
    if (!next && !pending) onClose();
  };

  return (
    <StatusDialog
      open={mode != null}
      onOpenChange={handleOpenChange}
      icon={Send}
      size="wide"
      title={title}
      description={
        isTest
          ? "This will send a [Test] copy only to your signed-in admin account."
          : "Please verify the audience, channels, and subject before queuing."
      }
      secondaryAction={{ label: "Cancel", disabled: pending, onClick: onClose }}
      primaryAction={{
        label: confirmLabel,
        loading: pending,
        onClick: onConfirm,
      }}
    >
      <div className="text-xs">
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
            <span className="capitalize text-ink">{state.classification}</span>
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
      </div>
    </StatusDialog>
  );
}
