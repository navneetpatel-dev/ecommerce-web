/**
 * Admin user-list filter UI copy. Not yet merged into the root `LABELS`
 * object — imported directly by the admin users hook/component until a
 * maintainer folds it into `labels.ts` (see task report "SHARED FILE CHANGES
 * NEEDED"). Keep flat string keys so the merge is a drop-in later.
 */
export const adminUsersFiltersLabels = {
  usersFilters: "Filters",
  changeRoleTrigger: "Change Role",
  changeUserRoleTitle: "Change User Role",
  changeUserRoleDescription:
    "Update role and permission access for {name}. Current role: {role}.",
  selectNewRoleLabel: "Select New Role",
  selectRolePlaceholder: "Select a role",
  loadingRoles: "Loading roles…",
  selectVendorStoreLabel: "Select Associated Vendor Store",
  selectVendorStorePlaceholder: "Select a vendor store",
  loadingVendorStores: "Loading vendor stores…",
  currentRoleMarker: "(Current)",
  usersSearch: "Search",
  usersSearchPlaceholder: "Search by name or email",
  usersStatus: "Status",
  usersAllStatuses: "All statuses",
  usersRole: "Role",
  usersAllRoles: "All roles",
  usersClearFilters: "Clear filters",
} as const;
