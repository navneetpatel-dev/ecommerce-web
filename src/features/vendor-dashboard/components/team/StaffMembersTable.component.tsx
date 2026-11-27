"use client";

import { DataTable } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { StaffMember } from "../../api/vendorStaff.api";
import { staffMemberColumns } from "./StaffMembersTable/staffMemberColumns";
import { StaffMemberActions } from "./StaffMembersTable/StaffMemberActions.component";

interface StaffMembersTableProps {
  members: StaffMember[];
  onRemove: (member: StaffMember) => void;
}

const getRowId = (member: StaffMember) => member.id;

export function StaffMembersTable({
  members,
  onRemove,
}: StaffMembersTableProps) {
  // The owner cannot be removed, so that row gets no menu.
  const renderActions = (member: StaffMember) =>
    member.isOwner ? null : (
      <StaffMemberActions member={member} onRemove={onRemove} />
    );

  return (
    <DataTable
      ariaLabel={LABELS.staffTableAria}
      columns={staffMemberColumns}
      rows={members}
      getRowId={getRowId}
      emptyMessage={LABELS.staffEmpty}
      actions={renderActions}
      rowDetails={false}
      enableFullscreen={false}
    />
  );
}
