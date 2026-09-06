/**
 * Admin user-detail and vendor-detail page copy. Subset of LABELS; not yet
 * merged into labels/index.ts (see SHARED FILE CHANGES NEEDED in the task
 * report) — imported directly by AdminUserDetailPage / AdminVendorDetailPage
 * until then.
 */
export const adminEntityDetailLabels = {
  backToUsers: "Back to users",
  backToVendors: "Back to vendors",
  userDetail: "User detail",
  vendorDetail: "Vendor detail",
  profileDetails: "Profile",
  addressesOnFile: "Addresses",
  noAddressesOnFile: "No addresses on file.",
  recentOrders: "Orders",
  noOrdersYet: "No orders yet.",
  linkedVendor: "Linked vendor",
  viewVendor: "View vendor",
  userCouldNotLoadDetail: "Could not load this user.",
  vendorCouldNotLoadDetail: "Could not load this vendor.",
  vendorCommissionRateHint:
    "Optional override. Used only when the vendor's category doesn't set its own commission rate; leave blank to use the platform default.",
  vendorApprovalCommissionRateHint:
    "Optional. Sets this vendor's commission override on approval — leave blank to keep the platform/category default.",
  vendorEditSection: "Vendor details",
  vendorEditSectionHint:
    "Update the vendor's business details, fulfillment settings, and commission override.",
  vendorSaved: "Vendor updated.",
} as const;
