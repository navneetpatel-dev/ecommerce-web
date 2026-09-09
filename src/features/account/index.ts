/** Public surface for the account feature: the customer/workspace
 * account page and its section navigation constants. */
export { AccountPage } from "./pages/layout/AccountPage.page";
export {
  ACCOUNT_SECTIONS,
  DEFAULT_ACCOUNT_SECTION,
  accountSectionsForRole,
  workspaceAccountSections,
} from "./constants/layout/constants";
export type { AccountProfile, AccountSectionId, AccountNavItem } from "./types/layout/types";
export {
  useAccountProfile,
  useUpdateProfile,
  useDeleteAccount,
  useAccountAddresses,
} from "./api/addresses/account.queries";
