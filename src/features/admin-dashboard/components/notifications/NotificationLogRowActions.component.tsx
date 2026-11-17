"use client";

import { useResendNotification } from "../../hooks/notifications/useResendNotification.hook";
import { emailHealthBannerStyles as styles } from "../../styles/notifications/emailHealthBanner.styles";
import { ResendNotificationButton } from "./ResendNotificationButton.component";

interface NotificationLogRowActionsProps {
  id: string;
  status: string;
  reload: () => void;
}

/** Actions for one row of the delivery log: a failed email can be sent again. */
export function NotificationLogRowActions({
  id,
  status,
  reload,
}: NotificationLogRowActionsProps) {
  const resend = useResendNotification(reload);

  if (status !== "FAILED") return null;

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
