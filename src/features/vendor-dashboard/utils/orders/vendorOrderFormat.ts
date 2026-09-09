/**
 * Display helpers for vendor order rows.
 *
 * Money and id formatting live in shared/utils/orderFormat so every surface renders
 * amounts identically — this module only re-exports them for the folder's barrel.
 */
export { formatInr, shortOrderId } from "@/shared/utils/formatting/orderFormat";
