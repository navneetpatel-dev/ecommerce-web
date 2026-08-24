/** Public surface for the account feature: the customer/workspace
 * account page and its section navigation constants. */
export { AccountPage } from "./pages/AccountPage.page";
export {
  ACCOUNT_SECTIONS,
  DEFAULT_ACCOUNT_SECTION,
  accountSectionsForRole,
  workspaceAccountSections,
} from "./constants";
export type { AccountProfile, AccountSectionId, AccountNavItem } from "./types";
export {
  useAccountProfile,
  useUpdateProfile,
  useDeleteAccount,
  useAccountAddresses,
} from "./api/account.queries";
