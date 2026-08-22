/** Display helpers for vendor order rows (ids and currency). */
export function shortOrderId(orderId: string) {
  return orderId.slice(0, 8);
}

export function formatInr(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}
