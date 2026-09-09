"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LABELS } from "@/shared/constants/labels";
import type { SupportTicketCategory } from "@/shared/constants/statuses";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import type { UploadedMediaAttachment } from "../TicketAttachmentUploader/index";
import { useCreateSupportTicket } from "../../../api/list/supportTickets.queries";
import {
  TICKET_DESCRIPTION_MAX,
  TICKET_SUBJECT_MAX,
} from "../../../constants/form/fieldLimits";
import { buildTicketFieldErrors } from "./utils";
import type { TicketField } from "./types";

export interface SubmitTicketOptions {
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
}

export function useSubmitTicket(props: SubmitTicketOptions) {
  const {
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
  } = props;
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
      const mapped = applyApiErrorsToManualForm<TicketField>(err, setErrors);
      setApiError(
        mapped ? null : getFormLevelApiError(err, LABELS.ticketCouldNotCreate),
      );
    }
  };

  return { onSubmit, apiError, create };
}
