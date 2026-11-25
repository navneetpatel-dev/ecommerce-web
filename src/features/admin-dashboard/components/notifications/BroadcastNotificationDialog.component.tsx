"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import { BroadcastNotificationForm } from "./BroadcastNotificationForm.component";

interface BroadcastNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BroadcastNotificationDialog({
  open,
  onOpenChange,
}: BroadcastNotificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{LABELS.broadcastTitle}</DialogTitle>
          <DialogDescription>{LABELS.broadcastHint}</DialogDescription>
        </DialogHeader>
        <BroadcastNotificationForm embedded />
      </DialogContent>
    </Dialog>
  );
}
