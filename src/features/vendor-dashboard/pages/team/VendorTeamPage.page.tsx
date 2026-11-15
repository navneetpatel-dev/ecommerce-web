"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { useVendorTeam } from "../../hooks/team/useVendorTeam.hook";
import { StaffMembersTable } from "../../components/team/StaffMembersTable.component";
import { AddStaffDialog } from "../../components/team/AddStaffDialog.component";
import { RemoveStaffDialog } from "../../components/team/RemoveStaffDialog.component";
import type { StaffMember } from "../../api/vendorStaff.api";

export function VendorTeamPage() {
  const {
    members,
    isLoading,
    error,
    actionError,
    setActionError,
    isSubmitting,
    addStaff,
    removeStaff,
  } = useVendorTeam();

  const [addOpen, setAddOpen] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] =
    useState<StaffMember | null>(null);

  const handleOpenAdd = () => {
    setActionError(null);
    setAddOpen(true);
  };

  const handleOpenRemove = (member: StaffMember) => {
    setActionError(null);
    setSelectedForRemoval(member);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <TextEyebrow>Store Administration</TextEyebrow>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Team &amp; Staff Members
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage who has access to update products, process orders, and handle
            fulfillment for your store.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          <div className="h-12 w-full animate-pulse rounded-xl bg-surface-raised" />
          <div className="h-40 w-full animate-pulse rounded-xl bg-surface" />
        </div>
      ) : (
        <StaffMembersTable members={members} onRemove={handleOpenRemove} />
      )}

      <AddStaffDialog
        open={addOpen}
        submitting={isSubmitting}
        error={actionError}
        onOpenChange={setAddOpen}
        onSubmit={addStaff}
      />

      <RemoveStaffDialog
        member={selectedForRemoval}
        submitting={isSubmitting}
        error={actionError}
        onOpenChange={(open) => !open && setSelectedForRemoval(null)}
        onConfirm={() => removeStaff(selectedForRemoval!.id)}
      />
    </div>
  );
}
