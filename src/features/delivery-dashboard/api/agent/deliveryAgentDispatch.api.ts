import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type {
  DeliveryPickup,
  DeliveryShipment,
  StaleTasksReport,
  UnassignedPickup,
  UnassignedShipment,
} from "../../types/agent/types";

/** Admin-facing shipment/pickup dispatch and assignment operations — composed into `deliveryAdminApi`. */
export const deliveryAdminDispatchApi = {
  unassignedShipments: () =>
    apiClient.get<UnassignedShipment[]>(API.deliveryAgents.unassignedShipments),
  unassignedPickups: () =>
    apiClient.get<UnassignedPickup[]>(API.deliveryAgents.unassignedPickups),
  bulkAssignShipments: (shipmentIds: string[], deliveryAgentId: string) =>
    apiClient.post<{ assigned: number }>(
      API.deliveryAgents.bulkAssignShipments,
      {
        shipmentIds,
        deliveryAgentId,
      },
    ),
  rtoShipments: () =>
    apiClient.get<DeliveryShipment[]>(API.deliveryAgents.rtoShipments),
  staleTasks: () =>
    apiClient.get<StaleTasksReport>(API.deliveryAgents.staleTasks),
  forceConfirmDelivery: (shipmentId: string, reason: string) =>
    apiClient.post<DeliveryShipment>(
      API.deliveryAgents.forceConfirmDelivery(shipmentId),
      { reason },
    ),
  assignShipment: (shipmentId: string, deliveryAgentId: string) =>
    apiClient.post<DeliveryShipment>(
      API.deliveryAgents.assignShipment(shipmentId),
      { deliveryAgentId },
    ),
  assignPickup: (returnId: string, deliveryAgentId: string) =>
    apiClient.post<DeliveryPickup>(API.deliveryAgents.assignPickup(returnId), {
      deliveryAgentId,
    }),
};
