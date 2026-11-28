/**
 * Admin user-list filter UI copy. Not yet merged into the root `LABELS`
 * object — imported directly by the admin users hook/component until a
 * maintainer folds it into `labels.ts` (see task report "SHARED FILE CHANGES
 * NEEDED"). Keep flat string keys so the merge is a drop-in later.
 */
export const adminUsersFiltersLabels = {
  usersFilters: "Filters",
  usersSearch: "Search",
  usersSearchPlaceholder: "Search by name or email",
  usersStatus: "Status",
  usersAllStatuses: "All statuses",
  usersRole: "Role",
  usersAllRoles: "All roles",
  usersClearFilters: "Clear filters",
} as const;
