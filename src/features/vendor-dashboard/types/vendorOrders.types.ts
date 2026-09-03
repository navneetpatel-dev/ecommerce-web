import type { Shipment, VendorInfo } from "@/shared/api/types";

/** Customer order containing one or more vendor sub-orders. */
export interface VendorOrder {
  id: string;
  subOrders?: VendorSubOrder[];
}

export interface VendorSubOrder {
  id: string;
  vendor: VendorInfo;
  subtotal: number;
  status: string;
  taxInvoiceNumber?: string | null;
  shipment?: Shipment | null;
}

/** A flattened order/sub-order pair for table rows. */
export interface SubOrderRow {
  orderId: string;
  subOrder: VendorSubOrder;
}
