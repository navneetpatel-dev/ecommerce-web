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

/** Known `entityType` values seen in `logAudit({ entityType, ... })` calls across the backend. */
export const AUDIT_ENTITY_TYPES = [
  "BugReport",
  "Coupon",
  "CouponBatch",
  "DeliveryAgent",
  "DeliveryAgentDocument",
  "DeliveryAgentPayout",
  "DeliveryCashDeposit",
  "Payout",
  "ReturnRequest",
  "Shipment",
  "SupportTicket",
  "Vendor",
  "VendorDocument",
] as const;
