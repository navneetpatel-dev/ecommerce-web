"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
    <Button
      type="button"
      size="sm"
      variant="outline"
      loading={loading}
      onClick={handleClick}
    >
      <RotateCw aria-hidden="true" />
      {LABELS.notificationResend}
    </Button>
  );
}
