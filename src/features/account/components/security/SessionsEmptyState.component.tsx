import { Monitor } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { securitySectionStyles as styles } from "./securitySection.styles";

export function SessionsEmptyState() {
  return (
    <EmptyState
      icon={Monitor}
      heading="No active sessions"
      message="Sign in again to see devices here."
      className={styles.emptyState}
      maxWidth="max-w-sm"
    />
  );
}
