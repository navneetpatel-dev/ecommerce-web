import type { SessionViewModel } from "./useSecuritySection.hook";
import { SessionRow } from "./SessionRow.component";
import { securitySectionStyles as styles } from "./securitySection.styles";

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
