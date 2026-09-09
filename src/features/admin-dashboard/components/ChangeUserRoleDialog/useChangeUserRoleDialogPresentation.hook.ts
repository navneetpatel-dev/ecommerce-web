import { useCallback, type ChangeEvent } from "react";
import { useChangeUserRoleDialog } from "../../hooks/useChangeUserRoleDialog.hook";

interface UseChangeUserRoleDialogPresentationProps {
  userId: string;
  currentVendorId?: string | null;
}

export function useChangeUserRoleDialogPresentation({
  userId,
  currentVendorId,
}: UseChangeUserRoleDialogPresentationProps) {
  const dialogState = useChangeUserRoleDialog({ userId, currentVendorId });
  const { setOpen, setSelectedRoleId, setSelectedVendorId, handleOpenChange } =
    dialogState;

  const handleOpenTrigger = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleRoleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedRoleId(e.target.value);
    },
    [setSelectedRoleId],
  );

  const handleVendorSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedVendorId(e.target.value);
    },
    [setSelectedVendorId],
  );

  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return {
    ...dialogState,
    handleOpenTrigger,
    handleRoleSelectChange,
    handleVendorSelectChange,
    handleCancel,
  };
}
