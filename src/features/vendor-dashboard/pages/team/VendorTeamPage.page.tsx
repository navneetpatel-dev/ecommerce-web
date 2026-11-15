"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { useVendorTeam } from "../../hooks/team/useVendorTeam.hook";
import { StaffMembersTable } from "../../components/team/StaffMembersTable.component";
import { AddStaffDialog } from "../../components/team/AddStaffDialog.component";
import { RemoveStaffDialog } from "../../components/team/RemoveStaffDialog.component";
import { vendorTeamStyles as styles } from "../../styles/team/vendorTeam.styles";

export function VendorTeamPage() {
  const {
    members,
    isLoading,
    error,
    actionError,
    isSubmitting,
    addStaff,
    addOpen,
    setAddOpen,
    selectedForRemoval,
    handleOpenAdd,
    handleOpenRemove,
    handleCloseRemove,
    handleConfirmRemove,
  } = useVendorTeam();

  const loadingContent = (
    <div className={styles.loadingStack}>
      <div className={styles.loadingPulseRaised} />
      <div className={styles.loadingPulseSurface} />
    </div>
  );

  const errorContent = error ? (
    <div className={styles.errorAlert}>{error}</div>
  ) : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <TextEyebrow>Store Administration</TextEyebrow>
          <h1 className={styles.heading}>Team &amp; Staff Members</h1>
          <p className={styles.description}>
            Manage who has access to update products, process orders, and handle
            fulfillment for your store.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <UserPlus className={styles.addBtnIcon} />
          Add Member
        </Button>
      </div>

      {errorContent}

      {isLoading ? (
        loadingContent
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
        onOpenChange={handleCloseRemove}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
