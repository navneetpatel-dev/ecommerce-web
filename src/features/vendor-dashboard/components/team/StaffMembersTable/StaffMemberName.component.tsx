import { ShieldCheck, UserCheck } from "lucide-react";
import type { StaffMember } from "../../../api/vendorStaff.api";
import { vendorTeamStyles as styles } from "../../../styles/team/vendorTeam.styles";

export function StaffMemberName({ member }: { member: StaffMember }) {
  const Icon = member.isOwner ? ShieldCheck : UserCheck;

  return (
    <span className={styles.name}>
      <Icon
        className={member.isOwner ? styles.ownerIcon : styles.staffIcon}
        aria-hidden
      />
      <span className={styles.nameText}>{member.name}</span>
    </span>
  );
}
