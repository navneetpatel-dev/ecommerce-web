"use client";

import { Undo2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { cancelReturnActionStyles as styles } from "../../styles/detail/cancelReturnAction.styles";

interface CancelReturnActionProps {
  confirmOpen: boolean;
  isPending: boolean;
  error: string | null;
  onOpen: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelReturnAction({
  confirmOpen,
  isPending,
  error,
  onOpen,
  onClose,
  onConfirm,
}: CancelReturnActionProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <div className={styles.container}>
      <Button type="button" variant="outline" onClick={onOpen}>
        {LABELS.cancelReturn}
      </Button>
      <FormError error={error} fallback={LABELS.couldNotCancelReturn} />
      <StatusDialog
        open={confirmOpen}
        onOpenChange={handleOpenChange}
        variant="warning"
        icon={Undo2}
        title={LABELS.cancelReturnTitle}
        description={LABELS.cancelReturnBody}
        secondaryAction={{ label: LABELS.keepReturn, onClick: onClose }}
        primaryAction={{
          label: LABELS.cancelReturn,
          variant: "destructive",
          loading: isPending,
          onClick: onConfirm,
        }}
      />
    </div>
  );
}
