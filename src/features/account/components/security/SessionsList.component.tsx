import type { SessionViewModel } from "../../hooks/security/useSecuritySection.hook";
import { SessionRow } from "./SessionRow.component";
import { securitySectionStyles as styles } from "../../styles/security/securitySection.styles";

interface SessionsListProps {
  sessions: SessionViewModel[];
  onRevoke: (family: string) => void;
}

export function SessionsList({ sessions, onRevoke }: SessionsListProps) {
  return (
    <ul className={styles.sessionsList}>
      {sessions.map((session) => (
        <SessionRow
          key={session.family}
          session={session}
          onRevoke={onRevoke}
        />
      ))}
    </ul>
  );
}
