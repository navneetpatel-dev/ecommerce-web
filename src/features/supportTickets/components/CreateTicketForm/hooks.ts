"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import { LABELS } from "@/shared/constants/labels";
import {
  SUPPORT_TICKET_CATEGORY,
  type SupportTicketCategory,
} from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { ordersApi } from "@/features/orders";
import { vendorsApi } from "@/features/vendors";
import type { UploadedMediaAttachment } from "../TicketAttachmentUploader";
import { useCreateSupportTicket } from "../../api/supportTickets.queries";
import {
  TICKET_DESCRIPTION_MAX,
  TICKET_SUBJECT_MAX,
} from "../../constants/fieldLimits";
import {
  collectOrderVendors,
  formatOrderOption,
  buildTicketFieldErrors,
} from "./utils";
import type { OrderVendorOption, TicketField } from "./types";

type FetchPage = (
  query: InfiniteSingleSelectPageQuery,
) => Promise<InfiniteSingleSelectPageResult>;

export function useOrderVendors(
  relatedOrderId: string,
  category: SupportTicketCategory,
  hasOrder: boolean,
  setRelatedVendorId: React.Dispatch<React.SetStateAction<string>>,
): OrderVendorOption[] {
  const [orderVendors, setOrderVendors] = useState<OrderVendorOption[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (!relatedOrderId.trim()) {
      queueMicrotask(() => setOrderVendors([]));
      return;
    }

    void (async () => {
      try {
        const order = await ordersApi.detail(relatedOrderId.trim());
        if (cancelled) return;
        const vendors = collectOrderVendors(order.subOrders ?? []);
        setOrderVendors(vendors);
        if (vendors.length === 0) {
          setRelatedVendorId("");
        } else if (vendors.length === 1) {
          setRelatedVendorId(vendors[0]!.id);
        } else {
          setRelatedVendorId((prev) =>
            vendors.some((vendor) => vendor.id === prev) ? prev : "",
          );
        }
      } catch {
        if (cancelled) return;
        setOrderVendors([]);
        setRelatedVendorId("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [relatedOrderId, setRelatedVendorId]);

  useEffect(() => {
    if (!hasOrder && category !== SUPPORT_TICKET_CATEGORY.VENDOR) {
      queueMicrotask(() => setRelatedVendorId(""));
    }
  }, [category, hasOrder, setRelatedVendorId]);

  return orderVendors;
}

export function useFetchOrdersPage(): FetchPage {
  return useCallback<FetchPage>(async (query) => {
    const result = await ordersApi.myOrders(query.page, query.limit);
    return {
      items: result.items.map((order) => ({
        id: order.id,
        label: formatOrderOption(order),
      })),
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
    };
  }, []);
}

export function useFetchVendorsPage(): FetchPage {
  return useCallback<FetchPage>(async (query) => {
    const result = await vendorsApi.directory({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
    return {
      items: result.items.map((vendor) => ({
        id: vendor.id,
        label: vendor.businessName,
      })),
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
    };
  }, []);
}

type SubmitTicketOptions = {
  subject: string;
  description: string;
  category: SupportTicketCategory;
  relatedOrderId: string;
  relatedVendorId: string;
  attachments: UploadedMediaAttachment[];
  vendorRequired: boolean;
  clearAll: () => void;
  setErrors: (errors: Partial<Record<TicketField, string>>) => void;
  successHref: (id: string) => string;
};

export function useSubmitTicket({
  subject,
  description,
  category,
  relatedOrderId,
  relatedVendorId,
  attachments,
  vendorRequired,
  clearAll,
  setErrors,
  successHref,
}: SubmitTicketOptions) {
  const router = useRouter();
  const create = useCreateSupportTicket();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    clearAll();

    const nextErrors = buildTicketFieldErrors(
      subject,
      description,
      relatedVendorId,
      vendorRequired,
    );
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const ticket = await create.mutateAsync({
        subject: subject.trim().slice(0, TICKET_SUBJECT_MAX),
        description: description.trim().slice(0, TICKET_DESCRIPTION_MAX),
        category,
        relatedOrderId: relatedOrderId.trim() || null,
        relatedVendorId: relatedVendorId.trim() || null,
        attachmentUrls: attachments.map(({ url, type, durationSeconds }) => ({
          url,
          type,
          durationSeconds,
        })),
      });
      router.push(successHref(ticket.id));
    } catch (err) {
      setApiError(getApiErrorMessage(err, LABELS.ticketCouldNotCreate));
    }
  };

  return { onSubmit, apiError, create };
}
