import {
  formatInr,
  formatOrderDate,
  shortOrderId,
} from "@/shared/utils/orderFormat";
import { STEP_LABELS } from "@/shared/utils/orderTimeline";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  TICKET_DESCRIPTION_MAX,
  TICKET_SUBJECT_MAX,
} from "../../constants/fieldLimits";
import type { OrderVendorOption, TicketField } from "./types";

export function formatOrderOption(order: {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: string | number;
}): string {
  const statusLabel =
    STEP_LABELS[order.status as keyof typeof STEP_LABELS] ?? order.status;
  return `#${shortOrderId(order.id)} · ${formatOrderDate(order.createdAt)} · ${statusLabel} · ${formatInr(Number(order.totalAmount))}`;
}

export function collectOrderVendors(
  subOrders: Array<{
    vendorId?: string;
    vendor?: { id?: string; businessName?: string } | null;
  }>,
): OrderVendorOption[] {
  const byId = new Map<string, OrderVendorOption>();
  for (const sub of subOrders) {
    const id = sub.vendor?.id || sub.vendorId;
    const businessName = sub.vendor?.businessName;
    if (!id || !businessName) continue;
    if (!byId.has(id)) byId.set(id, { id, businessName });
  }
  return Array.from(byId.values());
}

export function buildTicketFieldErrors(
  subject: string,
  description: string,
  relatedVendorId: string,
  vendorRequired: boolean,
): Partial<Record<TicketField, string>> {
  const trimmedSubject = subject.trim();
  const trimmedDescription = description.trim();
  const nextErrors: Partial<Record<TicketField, string>> = {};

  if (!trimmedSubject) {
    nextErrors.subject = LABELS.ticketSubjectRequired;
  } else if (trimmedSubject.length > TICKET_SUBJECT_MAX) {
    nextErrors.subject = formatLabel(LABELS.ticketSubjectTooLong, {
      max: String(TICKET_SUBJECT_MAX),
    });
  }

  if (!trimmedDescription) {
    nextErrors.description = LABELS.ticketDescriptionRequired;
  } else if (trimmedDescription.length > TICKET_DESCRIPTION_MAX) {
    nextErrors.description = formatLabel(LABELS.ticketDescriptionTooLong, {
      max: String(TICKET_DESCRIPTION_MAX),
    });
  }

  if (vendorRequired && !relatedVendorId.trim()) {
    nextErrors.relatedVendorId = LABELS.ticketVendorRequired;
  }

  return nextErrors;
}
