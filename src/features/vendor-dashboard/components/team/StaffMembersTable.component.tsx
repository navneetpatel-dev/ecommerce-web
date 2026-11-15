"use client";

import type { StaffMember } from "../../api/vendorStaff.api";
import { StaffMembersTableBody } from "./StaffMembersTable/StaffMembersTableBody.component";
import { vendorTeamStyles as styles } from "../../styles/team/vendorTeam.styles";

interface StaffMembersTableProps {
  members: StaffMember[];
  onRemove: (member: StaffMember) => void;
}

export function StaffMembersTable({
  members,
  onRemove,
}: StaffMembersTableProps) {
  if (members.length === 0) {
    return (
      <div className={styles.emptyBox}>
        No team members found. Click &quot;Add Member&quot; to invite a
        colleague to your store.
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Joined</th>
            <th className={styles.thRight}>Actions</th>
          </tr>
        </thead>
        <StaffMembersTableBody members={members} onRemove={onRemove} />
      </table>
    </div>
  );
}
