"use client";

import { useState } from "react";
import { useResendNotification } from "../../hooks/notifications/useResendNotification.hook";
import { emailHealthBannerStyles as styles } from "../../styles/notifications/emailHealthBanner.styles";
import { ResendNotificationButton } from "./ResendNotificationButton.component";

interface NotificationLogRowActionsProps {
  id: string;
  status: string;
  createdAt?: string;
  reload: () => void;
}

const STUCK_AFTER_MS = 15 * 60 * 1000;

/** Actions for one row of the delivery log: failed or >15m stuck pending emails can be resent. */
export function NotificationLogRowActions({
  id,
  status,
  createdAt,
  reload,
}: NotificationLogRowActionsProps) {
  const resend = useResendNotification(reload);
  const [mountTime] = useState(() => Date.now());

  const isStuckPending =
    status === "PENDING" &&
    Boolean(createdAt) &&
    mountTime - new Date(createdAt!).getTime() >= STUCK_AFTER_MS;

  if (status !== "FAILED" && !isStuckPending) return null;

  return (
    <div>
      <ResendNotificationButton
        id={id}
        loading={resend.pendingId === id}
        onResend={resend.resend}
      />
      {resend.error ? (
        <p role="alert" className={styles.detail}>
          {resend.error}
        </p>
      ) : null}
    </div>
  );
}
