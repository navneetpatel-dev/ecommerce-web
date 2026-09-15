/**
 * Audit log filter UI copy. Not yet merged into the root `LABELS` object —
 * imported directly by the audit admin hook/page until a maintainer folds it
 * into `labels.ts` (see task report "SHARED FILE CHANGES NEEDED"). Keep flat
 * string keys so the merge is a drop-in later.
 */
export const auditFiltersLabels = {
  auditFilters: "Filters",
  auditEntityType: "Entity type",
  auditAllEntityTypes: "All entity types",
  auditActor: "Actor",
  auditActorPlaceholder: "Search by actor name or email",
  auditClearFilters: "Clear filters",
} as const;

/**
 * Every distinct `entityType` value passed to `logAudit({ entityType, ... })` across the
 * backend (verified by grepping every `logAudit(` call site — see audit finding "entity-type
 * filter missing RBAC-relevant types"). Re-verify this list if a new `logAudit` call site is
 * added with a new entity type; there is no backend endpoint that derives it dynamically.
 */
export const AUDIT_ENTITY_TYPES = [
  "BugReport",
  "Coupon",
  "CouponBatch",
  "DeliveryAgent",
  "DeliveryAgentDocument",
  "DeliveryAgentPayout",
  "DeliveryCashDeposit",
  "Order",
  "Payout",
  "PlatformSetting",
  "Product",
  "ReturnRequest",
  "Role",
  "Shipment",
  "ShippingRate",
  "ShippingZone",
  "SupportTicket",
  "TaxRule",
  "User",
  "UserWallet",
  "Vendor",
  "VendorDocument",
] as const;
