export const deliveryAgentsRoutes = {
  list: "/api/delivery-agents",
  create: "/api/delivery-agents",
  unassignedShipments: "/api/delivery-agents/unassigned-shipments",
  update: (id: string) => `/api/delivery-agents/${id}`,
  tasks: (id: string) => `/api/delivery-agents/${id}/tasks`,
  assignShipment: (shipmentId: string) =>
    `/api/delivery-agents/shipments/${shipmentId}/assign`,
  assignPickup: (returnId: string) =>
    `/api/delivery-agents/returns/${returnId}/assign`,
  forceConfirmDelivery: (shipmentId: string) =>
    `/api/delivery-agents/shipments/${shipmentId}/force-confirm`,
  meProfile: "/api/delivery-agents/me/profile",
  meAvailability: "/api/delivery-agents/me/availability",
  meDeliveries: "/api/delivery-agents/me/deliveries",
  meDeliveryStatus: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/status`,
  meDeliveryRequestCode: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/request-code`,
  meDeliveryConfirm: (shipmentId: string) =>
    `/api/delivery-agents/me/deliveries/${shipmentId}/confirm`,
  mePickups: "/api/delivery-agents/me/pickups",
  mePickupRequestCode: (returnId: string) =>
    `/api/delivery-agents/me/pickups/${returnId}/request-code`,
  mePickupStatus: (returnId: string) =>
    `/api/delivery-agents/me/pickups/${returnId}/status`,
  mePickupConfirm: (returnId: string) =>
    `/api/delivery-agents/me/pickups/${returnId}/confirm`,
} as const;
