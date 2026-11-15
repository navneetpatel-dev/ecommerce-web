"use client";

import type { StaffMember } from "../../../api/vendorStaff.api";
import { StaffMemberRow } from "./StaffMemberRow.component";
import { vendorTeamStyles as styles } from "../../../styles/team/vendorTeam.styles";

interface StaffMembersTableBodyProps {
  members: StaffMember[];
  onRemove: (member: StaffMember) => void;
}

export function StaffMembersTableBody({
  members,
  onRemove,
}: StaffMembersTableBodyProps) {
  return (
    <tbody className={styles.tbody}>
      {members.map((member) => (
        <StaffMemberRow key={member.id} member={member} onRemove={onRemove} />
      ))}
    </tbody>
  );
}
