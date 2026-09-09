"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  SUPPORT_TICKET_CATEGORY,
  type SupportTicketCategory,
} from "@/shared/constants/statuses";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/validation/firstMissingRequiredHint";
import {
  TICKET_DESCRIPTION_MAX,
  TICKET_SUBJECT_MAX,
} from "../../constants/form/fieldLimits";
import type { UploadedMediaAttachment } from "../../components/form/TicketAttachmentUploader/index";
import { useOrderVendors } from "./useOrderVendors.hook";
import {
  useFetchOrdersPage,
  useFetchVendorsPage,
} from "./useTicketPickerPages.hook";
import { useSubmitTicket } from "./useSubmitTicket.hook";
import type { TicketField } from "../../types/form/types";

interface UseCreateTicketFormParams {
  successHref: (id: string) => string;
}

export function useCreateTicketForm({
  successHref,
}: UseCreateTicketFormParams) {
  const draftId = useMemo(() => crypto.randomUUID(), []);
  const [subjectId, descId] = [useId(), useId()];
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SupportTicketCategory>(
    SUPPORT_TICKET_CATEGORY.OTHER,
  );
  const [relatedOrderId, setRelatedOrderId] = useState("");
  const [relatedVendorId, setRelatedVendorId] = useState("");
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([]);
  const { clearAll, clearField, setErrors, getError, hasError } =
    useManualFormFieldErrors<TicketField>();

  const hasOrder = Boolean(relatedOrderId.trim());
  const orderVendors = useOrderVendors(
    relatedOrderId,
    category,
    hasOrder,
    setRelatedVendorId,
  );
  const fetchOrdersPage = useFetchOrdersPage();
  const fetchVendorsPage = useFetchVendorsPage();
  const showDirectoryVendorPicker =
    !hasOrder && category === SUPPORT_TICKET_CATEGORY.VENDOR;
  const showOrderVendorPicker = hasOrder && orderVendors.length > 1;
  const showVendorSection =
    showDirectoryVendorPicker ||
    showOrderVendorPicker ||
    (hasOrder && orderVendors.length === 1);
  const hasSingleOrderVendor = hasOrder && orderVendors.length === 1;
  const vendorRequired =
    category === SUPPORT_TICKET_CATEGORY.VENDOR || orderVendors.length > 1;

  const requiredChecks = useMemo(
    () => [
      { ok: Boolean(subject.trim()), message: LABELS.enterTicketSubject },
      {
        ok: Boolean(description.trim()),
        message: LABELS.enterTicketDescription,
      },
      {
        ok: !vendorRequired || Boolean(relatedVendorId.trim()),
        message: LABELS.selectTicketVendor,
      },
    ],
    [subject, description, vendorRequired, relatedVendorId],
  );
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";

  const handleSubjectChange = useCallback(
    (value: string) => {
      clearField("subject");
      setSubject(value.slice(0, TICKET_SUBJECT_MAX));
    },
    [clearField],
  );
  const handleDescriptionChange = useCallback(
    (value: string) => {
      clearField("description");
      setDescription(value.slice(0, TICKET_DESCRIPTION_MAX));
    },
    [clearField],
  );
  const handleRelatedVendorIdChange = useCallback(
    (value: string) => {
      clearField("relatedVendorId");
      setRelatedVendorId(value);
    },
    [clearField],
  );

  const { onSubmit, apiError, create } = useSubmitTicket({
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
  });

  return {
    draftId,
    subjectId,
    descId,
    subject,
    description,
    category,
    setCategory,
    relatedOrderId,
    setRelatedOrderId,
    relatedVendorId,
    attachments,
    setAttachments,
    getError,
    hasError,
    orderVendors,
    fetchOrdersPage,
    fetchVendorsPage,
    showDirectoryVendorPicker,
    showOrderVendorPicker,
    showVendorSection,
    hasSingleOrderVendor,
    canSubmit,
    disableHint,
    handleSubjectChange,
    handleDescriptionChange,
    handleRelatedVendorIdChange,
    onSubmit,
    apiError,
    create,
  };
}
