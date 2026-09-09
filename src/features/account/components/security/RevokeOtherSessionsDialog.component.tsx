import { LogOut } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";

interface RevokeOtherSessionsDialogProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevokeOtherSessionsDialog({
  open,
  isPending,
  onClose,
  onConfirm,
}: RevokeOtherSessionsDialogProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="warning"
      icon={LogOut}
      title="Sign out other devices?"
      description="All sessions except this one will be ended. Those devices will need to sign in again."
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
      primaryAction={{
        label: "Sign out others",
        loading: isPending,
        onClick: onConfirm,
      }}
    />
  );
}
