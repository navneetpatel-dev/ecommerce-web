import { Button } from "@/shared/components/ui/button";
import type { SessionViewModel } from "../../hooks/security/useSecuritySection.hook";
import { securitySectionStyles as styles } from "../../styles/security/securitySection.styles";

interface SessionRowProps {
  session: SessionViewModel;
  onRevoke: (family: string) => void;
}

export function SessionRow({ session, onRevoke }: SessionRowProps) {
  const handleRevokeClick = () => {
    onRevoke(session.family);
  };

  return (
    <li className={styles.sessionRow}>
      <div className={styles.sessionDetails}>
        <p className={styles.deviceName}>
          {session.device}
          {session.isCurrent && (
            <span className={styles.currentDeviceBadge}>This device</span>
          )}
        </p>
        <p className={styles.sessionMeta}>
          {session.ip} · Last active{" "}
          <time dateTime={session.lastUsedAt}>
            {session.formattedLastActive}
          </time>
        </p>
      </div>
      {!session.isCurrent && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={styles.revokeButton}
          onClick={handleRevokeClick}
        >
          Revoke
        </Button>
      )}
    </li>
  );
}
