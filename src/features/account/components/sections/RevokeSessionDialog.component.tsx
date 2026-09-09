import { LogOut } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";

interface RevokeSessionDialogProps {
  open: boolean;
  targetDeviceName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevokeSessionDialog({
  open,
  targetDeviceName,
  isPending,
  onClose,
  onConfirm,
}: RevokeSessionDialogProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="warning"
      icon={LogOut}
      title="Revoke this session?"
      description={`End the session on ${targetDeviceName}. That device will need to sign in again.`}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
      primaryAction={{
        label: "Revoke",
        variant: "destructive",
        loading: isPending,
        onClick: onConfirm,
      }}
    />
  );
}
