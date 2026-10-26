/**
 * Admin "force confirm delivery" override copy. NOT YET merged into the
 * root `LABELS` object (labels.ts is a shared file edited centrally) — see
 * the "SHARED FILE CHANGES NEEDED" note left for this task. Imported
 * directly by StaleTasksPanel.component.tsx in the meantime.
 */
export const deliveryForceConfirmLabels = {
  forceConfirmDelivery: "Force confirm delivery",
  forceConfirmDeliveryTitle: "Force confirm this delivery?",
  forceConfirmDeliveryBody:
    "This marks the shipment DELIVERED without OTP verification. Use this only when the agent has physical proof of delivery (signed slip, photo) and the customer is unreachable. This action is audited.",
  forceConfirmDeliveryReasonLabel: "Reason for override",
  forceConfirmDeliveryReasonHint:
    "Explain the proof of delivery you're relying on (at least 3 characters).",
  forceConfirmDeliverySuccess: "Delivery force-confirmed.",
  forceConfirmCodCollected: "Force confirm · cash collected",
  forceConfirmCodNotCollected: "Force confirm · cash not collected",
  forceConfirmCodCollectedBody:
    "Marks the shipment DELIVERED without OTP verification, with the cash on delivery collected: the agent owes it. Only with proof the cash was paid. Audited.",
  forceConfirmCodNotCollectedBody:
    "Marks the shipment DELIVERED without OTP verification, with no cash collected: the order stays unpaid and the agent owes nothing for it. Audited.",
} as const;
