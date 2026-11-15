"use client";

import { Trash2, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
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
          <Button
            size="sm"
            variant="ghost"
            className={styles.removeBtn}
            onClick={handleRemoveClick}
          >
            <Trash2 className={styles.removeBtnIcon} />
            Remove
          </Button>
        )}
      </td>
    </tr>
  );
}
