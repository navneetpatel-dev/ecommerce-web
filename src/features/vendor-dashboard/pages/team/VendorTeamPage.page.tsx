"use client";

import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { useVendorTeam } from "../../hooks/team/useVendorTeam.hook";
import { StaffMembersTable } from "../../components/team/StaffMembersTable.component";
import { AddStaffDialog } from "../../components/team/AddStaffDialog.component";
import { RemoveStaffDialog } from "../../components/team/RemoveStaffDialog.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";
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

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const match =
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (role && m.roleName !== role) return false;
      return true;
    });
  }, [members, debouncedSearch, role]);

  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.roleName) set.add(m.roleName);
    });
    return Array.from(set);
  }, [members]);

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

      {members.length > 0 && (
        <CollapsibleTableFilters
          activeCount={(search ? 1 : 0) + (role ? 1 : 0)}
          onClear={() => {
            setSearch("");
            setRole("");
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
            <FormFieldFrame
              label={LABELS.search}
              htmlFor="vendor-team-filter-search"
            >
              <Input
                id="vendor-team-filter-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name or email..."
              />
            </FormFieldFrame>

            {uniqueRoles.length > 0 && (
              <FormFieldFrame
                label={LABELS.role}
                htmlFor="vendor-team-filter-role"
              >
                <Select
                  value={role || "__ALL__"}
                  onValueChange={(val) => setRole(val === "__ALL__" ? "" : val)}
                >
                  <SelectTrigger id="vendor-team-filter-role">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">All Roles</SelectItem>
                    {uniqueRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r.replace(/^VENDOR_/, "").replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
            )}
          </div>
        </CollapsibleTableFilters>
      )}

      {isLoading ? (
        loadingContent
      ) : (
        <StaffMembersTable
          members={filteredMembers}
          onRemove={handleOpenRemove}
        />
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
