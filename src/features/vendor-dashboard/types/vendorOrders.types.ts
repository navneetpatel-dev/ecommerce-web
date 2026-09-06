import type { Shipment, VendorInfo } from "@/shared/api/types";

/**
 * Read-only return/exchange visibility for a vendor sub-order — vendors can
 * see status and the assigned pickup agent, but can't change either here
 * (that lifecycle stays owned by the returns module).
 */
export interface VendorReturnRequest {
  id: string;
  status: string;
  type?: "REFUND" | "EXCHANGE";
  deliveryAgent?: { id: string; fullName: string; phone: string } | null;
}

export interface VendorSubOrder {
  id: string;
  /** Parent order id — the backend returns a flat list of sub-orders, each carrying its own orderId. */
  orderId: string;
  vendor: VendorInfo;
  subtotal: number;
  status: string;
  taxInvoiceNumber?: string | null;
  shipment?: Shipment | null;
  returnRequests?: VendorReturnRequest[];
}

/** A flattened order/sub-order pair for table rows. */
export interface SubOrderRow {
  orderId: string;
  subOrder: VendorSubOrder;
}
