"use client";

import { Trash2, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { HOVER_ON_SURFACE_ROW } from "@/shared/styles/interaction.styles";
import { cn } from "@/shared/utils/dom/cn";
import type { StaffMember } from "../../api/vendorStaff.api";

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
      <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
        No team members found. Click &quot;Add Member&quot; to invite a
        colleague to your store.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full text-left text-sm text-ink">
        <thead className="border-b border-line bg-surface-raised text-xs font-semibold uppercase text-ink-muted">
          <tr>
            <th className="px-5 py-3.5">Name</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Role</th>
            <th className="px-5 py-3.5">Joined</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {members.map((member) => (
            <tr
              key={member.id}
              className={cn("transition-colors", HOVER_ON_SURFACE_ROW)}
            >
              <td className="flex items-center gap-2 px-5 py-4 font-medium text-ink">
                {member.isOwner ? (
                  <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
                ) : (
                  <UserCheck className="h-4 w-4 shrink-0 text-ink-muted" />
                )}
                <span>{member.name}</span>
              </td>
              <td className="px-5 py-4 font-mono text-xs text-ink-muted">
                {member.email}
              </td>
              <td className="px-5 py-4">
                <Badge variant={member.isOwner ? "default" : "outline"}>
                  {member.isOwner ? "Owner" : "Staff"}
                </Badge>
              </td>
              <td className="px-5 py-4 text-xs text-ink-muted">
                {formatOrderDate(member.createdAt)}
              </td>
              <td className="px-5 py-4 text-right">
                {member.isOwner ? (
                  <span className="text-xs italic text-ink-faint">
                    Primary Owner
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onRemove(member)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
