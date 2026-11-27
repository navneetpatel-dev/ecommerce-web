"use client";

import { RotateCw } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";

interface ResendNotificationButtonProps {
  id: string;
  loading: boolean;
  onResend: (id: string) => void;
}

/** "Resend" for one failed email in the delivery log. */
export function ResendNotificationButton({
  id,
  loading,
  onResend,
}: ResendNotificationButtonProps) {
  const handleClick = () => onResend(id);

  return (
    <RowActionButton
      icon={RotateCw}
      label={LABELS.notificationResend}
      loading={loading}
      onClick={handleClick}
    />
  );
}
