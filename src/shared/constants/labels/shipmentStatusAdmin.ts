/** Admin shipment status controls and the RTO queue. Subset of LABELS. */
export const shipmentStatusAdminLabels = {
  // RTO queue
  rtoQueueTitle: "Return to origin (RTO) queue",
  rtoQueueEmpty: "No shipments are currently returning to origin.",
  rtoAwaitingReceiptBadge: "{count} awaiting receipt",
  flagsFailedAttempts: "Failed attempts",
  lastNoteColumn: "Last note",
  orderNumberColumn: "Order",
  actionsColumn: "Actions",

  // Shipment status update
  updateShipmentStatus: "Update status",
  shipmentNextStatusLabel: "Move shipment to",
  shipmentNextStatusPlaceholder: "Choose a status",
  shipmentStatusInTransit: "In transit",
  shipmentStatusOutForDelivery: "Out for delivery",
  shipmentStatusDelivered: "Delivered",
  shipmentStatusFailed: "Failed delivery attempt",
  shipmentStatusRtoInitiated: "Return to origin",
  shipmentStatusRtoDelivered: "Received back (RTO)",
  shipmentFailureReasonLabel: "Why did the attempt fail?",
  shipmentFailureReasonPlaceholder: "e.g. Customer not at home",
  shipmentCodCollectedLabel: "Cash on delivery collected",
  shipmentCodCollectedHint:
    "Tick only when the courier collected the cash. Left unticked, the order stays unpaid.",
  shipmentStatusUpdated: "Shipment status updated.",
  shipmentStatusUpdateFailed: "Could not update the shipment status.",
  shipmentNoFurtherStatus: "No further status changes for this shipment.",
  markRtoReceived: "Mark received",
} as const;
