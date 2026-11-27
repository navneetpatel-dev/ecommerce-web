"use client";

import { Trash2 } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import type { StaffMember } from "../../../api/vendorStaff.api";

interface StaffMemberActionsProps {
  member: StaffMember;
  onRemove: (member: StaffMember) => void;
}

export function StaffMemberActions({
  member,
  onRemove,
}: StaffMemberActionsProps) {
  const handleRemoveClick = () => onRemove(member);

  return (
    <RowActionButton
      kind="danger"
      icon={Trash2}
      label={LABELS.remove}
      onClick={handleRemoveClick}
    />
  );
}
