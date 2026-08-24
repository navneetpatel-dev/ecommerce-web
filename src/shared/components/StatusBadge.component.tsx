import { Badge } from "./ui/badge";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRODUCT_STATUS,
  VENDOR_STATUS,
  USER_STATUS,
  SHIPMENT_STATUS,
  REVIEW_STATUS,
  CATEGORY_STATUS,
  COUPON_STATUS,
  SUPPORT_TICKET_STATUS,
  SUPPORT_TICKET_PRIORITY,
  BUG_REPORT_STATUS,
  BUG_REPORT_SEVERITY,
  VENDOR_DOCUMENT_CHECKLIST_STATUS,
} from "@/shared/constants/statuses";

type BadgeVariant =
  | "success"
  | "warning"
  | "destructive"
  | "secondary"
  | "brand"
  | "tag"
  | "outline";

const SUCCESS = new Set<string>([
  PRODUCT_STATUS.LIVE,
  VENDOR_STATUS.APPROVED,
  REVIEW_STATUS.APPROVED,
  USER_STATUS.ACTIVE,
  PAYMENT_STATUS.PAID,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CONFIRMED,
  CATEGORY_STATUS.ACTIVE,
  SUPPORT_TICKET_STATUS.RESOLVED,
  BUG_REPORT_STATUS.FIXED,
  BUG_REPORT_STATUS.VERIFIED,
  "COMPLETED",
]);

const BRAND = new Set<string>([
  ORDER_STATUS.SHIPPED,
  SHIPMENT_STATUS.PICKED_UP,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.OUT_FOR_DELIVERY,
  SUPPORT_TICKET_STATUS.IN_PROGRESS,
  BUG_REPORT_STATUS.IN_PROGRESS,
  BUG_REPORT_STATUS.TRIAGED,
  SUPPORT_TICKET_PRIORITY.HIGH,
  BUG_REPORT_SEVERITY.HIGH,
  "PROCESSING",
]);

const WARNING = new Set<string>([
  ORDER_STATUS.PENDING,
  PRODUCT_STATUS.PENDING_APPROVAL,
  PRODUCT_STATUS.DRAFT,
  ORDER_STATUS.RETURNED,
  REVIEW_STATUS.PENDING,
  VENDOR_STATUS.PENDING,
  PAYMENT_STATUS.PENDING,
  SUPPORT_TICKET_STATUS.OPEN,
  SUPPORT_TICKET_STATUS.REOPENED,
  BUG_REPORT_STATUS.NEW,
  SUPPORT_TICKET_PRIORITY.URGENT,
  BUG_REPORT_SEVERITY.CRITICAL,
  VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW,
]);

const DESTRUCTIVE = new Set<string>([
  VENDOR_STATUS.REJECTED,
  REVIEW_STATUS.REJECTED,
  PRODUCT_STATUS.REJECTED,
  COUPON_STATUS.REJECTED,
  PAYMENT_STATUS.FAILED,
  ORDER_STATUS.CANCELLED,
  USER_STATUS.BLOCKED,
  PAYMENT_STATUS.REFUNDED,
  CATEGORY_STATUS.ARCHIVED,
  SUPPORT_TICKET_STATUS.CLOSED,
  BUG_REPORT_STATUS.CLOSED,
  BUG_REPORT_STATUS.WONT_FIX,
  BUG_REPORT_STATUS.DUPLICATE,
  VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED,
]);

const TAG = new Set<string>([VENDOR_DOCUMENT_CHECKLIST_STATUS.NOT_UPLOADED]);

function getVariant(status: string): BadgeVariant {
  const normalized = status.toUpperCase();
  if (SUCCESS.has(normalized)) return "success";
  if (BRAND.has(normalized)) return "brand";
  if (WARNING.has(normalized)) return "warning";
  if (DESTRUCTIVE.has(normalized)) return "destructive";
  if (TAG.has(normalized)) return "tag";
  return "secondary";
}

interface StatusBadgeProps {
  status: string;
  /** Override visible text (status still drives color). */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = getVariant(status);
  return (
    <Badge variant={variant} className={className}>
      {label ?? status.replace(/_/g, " ")}
    </Badge>
  );
}
