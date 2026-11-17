"use client";

import { useState, useMemo } from "react";
import { UserPlus, Search, X } from "lucide-react";
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

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const match =
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (role && m.roleName !== role) return false;
      return true;
    });
  }, [members, search, role]);

  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.roleName) set.add(m.roleName);
    });
    return Array.from(set);
  }, [members]);

  const hasFilters = Boolean(search || role);

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-line bg-surface p-4 shadow-sm mb-4">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name or email..."
                className="pl-9 h-9 text-sm"
              />
            </div>
            {uniqueRoles.length > 0 && (
              <div className="w-full sm:w-44">
                <Select
                  value={role || "__ALL__"}
                  onValueChange={(val) => setRole(val === "__ALL__" ? "" : val)}
                >
                  <SelectTrigger className="h-9 text-sm">
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
              </div>
            )}
          </div>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setRole("");
              }}
              className="text-text-muted hover:text-text shrink-0 h-9"
            >
              <X className="size-4 mr-1.5" />
              Clear Filters
            </Button>
          )}
        </div>
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
