"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { FormStack } from "@/shared/components/forms";
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
} from "../../../constants/form/fieldLimits";
import type { UploadedMediaAttachment } from "../TicketAttachmentUploader/index";
import { FormHeader } from "./FormHeader.component";
import { createTicketFormStyles } from "../../../styles/form/createTicketForm.styles";
import { useOrderVendors } from "../../../hooks/form/useOrderVendors.hook";
import {
  useFetchOrdersPage,
  useFetchVendorsPage,
} from "../../../hooks/form/useTicketPickerPages.hook";
import { useSubmitTicket } from "../../../hooks/form/useSubmitTicket.hook";
import { SubmitArea, TicketAttachmentsSection } from "./SubmitArea.component";
import { TicketBasicsSection } from "./TicketBasicsSection.component";
import { TicketDescriptionSection } from "./TicketDescriptionSection.component";
import { TicketOrderSection } from "./TicketOrderSection.component";
import { TicketVendorSection } from "./TicketVendorSection.component";
import type { TicketField } from "../../../types/form/types";

type Props = {
  successHref: (id: string) => string;
};

export function CreateTicketForm({ successHref }: Props) {
  const draftId = useMemo(() => crypto.randomUUID(), []);

  const subjectId = useId();
  const descId = useId();

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

  return (
    <form onSubmit={onSubmit} className={createTicketFormStyles.form}>
      <FormStack className={createTicketFormStyles.stack}>
        <FormHeader
          canSubmit={canSubmit}
          disableHint={disableHint}
          isPending={create.isPending}
        />

        <TicketBasicsSection
          subjectId={subjectId}
          subject={subject}
          onSubjectChange={handleSubjectChange}
          subjectError={getError("subject")}
          hasSubjectError={hasError("subject")}
          category={category}
          onCategoryChange={setCategory}
        />

        <TicketDescriptionSection
          descId={descId}
          description={description}
          onDescriptionChange={handleDescriptionChange}
          descriptionError={getError("description")}
          hasDescriptionError={hasError("description")}
        />

        <TicketOrderSection
          relatedOrderId={relatedOrderId}
          onRelatedOrderIdChange={setRelatedOrderId}
          fetchOrdersPage={fetchOrdersPage}
        />

        {showVendorSection ? (
          <TicketVendorSection
            showDirectoryVendorPicker={showDirectoryVendorPicker}
            showOrderVendorPicker={showOrderVendorPicker}
            hasSingleOrderVendor={hasOrder && orderVendors.length === 1}
            orderVendors={orderVendors}
            relatedVendorId={relatedVendorId}
            onRelatedVendorIdChange={handleRelatedVendorIdChange}
            getError={getError}
            hasError={hasError}
            fetchVendorsPage={fetchVendorsPage}
          />
        ) : null}

        <TicketAttachmentsSection
          entityId={draftId}
          value={attachments}
          onChange={setAttachments}
          disabled={create.isPending}
        />

        <SubmitArea
          apiError={apiError}
          createError={create.error}
          canSubmit={canSubmit}
          disableHint={disableHint}
          isPending={create.isPending}
        />
      </FormStack>
    </form>
  );
}
