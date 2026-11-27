"use client";

import { Trash2, ShieldCheck, UserCheck } from "lucide-react";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { Badge } from "@/shared/components/ui/badge";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import { HOVER_ON_SURFACE_ROW } from "@/shared/styles/interaction.styles";
import { cn } from "@/shared/utils/dom/cn";
import type { StaffMember } from "../../../api/vendorStaff.api";
import { vendorTeamStyles as styles } from "../../../styles/team/vendorTeam.styles";

interface StaffMemberRowProps {
  member: StaffMember;
  onRemove: (member: StaffMember) => void;
}

export function StaffMemberRow({ member, onRemove }: StaffMemberRowProps) {
  const handleRemoveClick = () => {
    onRemove(member);
  };

  return (
    <tr className={cn("transition-colors", HOVER_ON_SURFACE_ROW)}>
      <td className={styles.tdName}>
        {member.isOwner ? (
          <ShieldCheck className={styles.ownerIcon} />
        ) : (
          <UserCheck className={styles.staffIcon} />
        )}
        <span>{member.name}</span>
      </td>
      <td className={styles.tdEmail}>{member.email}</td>
      <td className={styles.tdRole}>
        <Badge variant={member.isOwner ? "default" : "outline"}>
          {member.isOwner ? "Owner" : "Staff"}
        </Badge>
      </td>
      <td className={styles.tdJoined}>{formatOrderDate(member.createdAt)}</td>
      <td className={styles.tdActions}>
        {member.isOwner ? (
          <span className={styles.primaryOwnerNote}>Primary Owner</span>
        ) : (
          <TableRowActions>
            <RowActionButton
              kind="danger"
              icon={Trash2}
              label={LABELS.remove}
              onClick={handleRemoveClick}
            />
          </TableRowActions>
        )}
      </td>
    </tr>
  );
}
