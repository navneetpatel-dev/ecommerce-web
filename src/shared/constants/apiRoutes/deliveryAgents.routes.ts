export const deliveryAgentsRoutes = {
  list: "/api/delivery-agents",
  create: "/api/delivery-agents",
  unassignedShipments: "/api/delivery-agents/unassigned-shipments",
  unassignedPickups: "/api/delivery-agents/unassigned-pickups",
  rtoShipments: "/api/delivery-agents/rto-shipments",
  performanceReport: "/api/delivery-agents/reports/performance",
  staleTasks: "/api/delivery-agents/reports/stale",
  bulkCreate: "/api/delivery-agents/bulk",
  cashDeposits: "/api/delivery-agents/cash-deposits",
  verifyCashDeposit: (depositId: string) =>
    `/api/delivery-agents/cash-deposits/${depositId}`,
  payouts: "/api/delivery-agents/payouts",
  processPayouts: "/api/delivery-agents/payouts/process",
  markPayoutPaid: (payoutId: string) =>
    `/api/delivery-agents/payouts/${payoutId}/mark-paid`,
  markPayoutFailed: (payoutId: string) =>
    `/api/delivery-agents/payouts/${payoutId}/mark-failed`,
  retryPayout: (payoutId: string) =>
    `/api/delivery-agents/payouts/${payoutId}/retry`,
  payoutStatement: (payoutId: string) =>
    `/api/delivery-agents/payouts/${payoutId}/statement.pdf`,
  documents: "/api/delivery-agents/documents",
  reviewDocument: (documentId: string) =>
    `/api/delivery-agents/documents/${documentId}/review`,
  update: (id: string) => `/api/delivery-agents/${id}`,
  tasks: (id: string) => `/api/delivery-agents/${id}/tasks`,
  assignShipment: (shipmentId: string) =>
    `/api/delivery-agents/shipments/${shipmentId}/assign`,
  bulkAssignShipments: "/api/delivery-agents/shipments/bulk-assign",
  assignPickup: (returnId: string) =>
    `/api/delivery-agents/returns/${returnId}/assign`,
  forceConfirmDelivery: (shipmentId: string) =>
    `/api/delivery-agents/shipments/${shipmentId}/force-confirm`,
  meProfile: "/api/delivery-agents/me/profile",
  meRatings: "/api/delivery-agents/me/ratings",
  meAvailability: "/api/delivery-agents/me/availability",
  meLocation: "/api/delivery-agents/me/location",
  meShiftSummary: "/api/delivery-agents/me/shift-summary",
  meCashShiftClose: "/api/delivery-agents/me/cash-shift/close",
  meCashDeposits: "/api/delivery-agents/me/cash-deposits",
  mePayouts: "/api/delivery-agents/me/payouts",
  meEarnings: "/api/delivery-agents/me/earnings",
  mePayoutStatement: (payoutId: string) =>
    `/api/delivery-agents/me/payouts/${payoutId}/statement.pdf`,
  meBankDetails: "/api/delivery-agents/me/bank-details",
  meDocuments: "/api/delivery-agents/me/documents",
  meDeliveries: "/api/delivery-agents/me/deliveries",
  meDelivery: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}`,
  meDeliveryStatus: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/status`,
  meDeliveryRequestCode: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/request-code`,
  meDeliveryConfirm: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/confirm`,
  meRtoHandoverRequestCode: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/rto-handover/request-code`,
  meRtoHandoverConfirm: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/rto-handover/confirm`,
  mePickups: "/api/delivery-agents/me/pickups",
  mePickup: (returnId: string) => `/api/delivery-agents/me/pickups/${returnId}`,
  mePickupRequestCode: (returnId: string) =>
    `/api/delivery-agents/me/pickups/${returnId}/request-code`,
  mePickupStatus: (returnId: string) =>
    `/api/delivery-agents/me/pickups/${returnId}/status`,
  mePickupConfirm: (returnId: string) =>
    `/api/delivery-agents/me/pickups/${returnId}/confirm`,
} as const;
