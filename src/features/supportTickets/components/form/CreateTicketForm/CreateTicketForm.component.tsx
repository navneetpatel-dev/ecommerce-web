"use client";

import { FormStack } from "@/shared/components/forms";
import { FormHeader } from "./FormHeader.component";
import { createTicketFormStyles } from "../../../styles/form/createTicketForm.styles";
import { useCreateTicketForm } from "../../../hooks/form/useCreateTicketForm.hook";
import { SubmitArea, TicketAttachmentsSection } from "./SubmitArea.component";
import { TicketBasicsSection } from "./TicketBasicsSection.component";
import { TicketDescriptionSection } from "./TicketDescriptionSection.component";
import { TicketOrderSection } from "./TicketOrderSection.component";
import { TicketVendorSection } from "./TicketVendorSection.component";

type Props = {
  successHref: (id: string) => string;
};

export function CreateTicketForm({ successHref }: Props) {
  const form = useCreateTicketForm({ successHref });

  return (
    <form onSubmit={form.onSubmit} className={createTicketFormStyles.form}>
      <FormStack className={createTicketFormStyles.stack}>
        <FormHeader
          canSubmit={form.canSubmit}
          disableHint={form.disableHint}
          isPending={form.create.isPending}
        />

        <TicketBasicsSection
          subjectId={form.subjectId}
          subject={form.subject}
          onSubjectChange={form.handleSubjectChange}
          subjectError={form.getError("subject")}
          hasSubjectError={form.hasError("subject")}
          category={form.category}
          onCategoryChange={form.setCategory}
        />

        <TicketDescriptionSection
          descId={form.descId}
          description={form.description}
          onDescriptionChange={form.handleDescriptionChange}
          descriptionError={form.getError("description")}
          hasDescriptionError={form.hasError("description")}
        />

        <TicketOrderSection
          relatedOrderId={form.relatedOrderId}
          onRelatedOrderIdChange={form.setRelatedOrderId}
          fetchOrdersPage={form.fetchOrdersPage}
        />

        {form.showVendorSection ? (
          <TicketVendorSection
            showDirectoryVendorPicker={form.showDirectoryVendorPicker}
            showOrderVendorPicker={form.showOrderVendorPicker}
            hasSingleOrderVendor={form.hasSingleOrderVendor}
            orderVendors={form.orderVendors}
            relatedVendorId={form.relatedVendorId}
            onRelatedVendorIdChange={form.handleRelatedVendorIdChange}
            getError={form.getError}
            hasError={form.hasError}
            fetchVendorsPage={form.fetchVendorsPage}
          />
        ) : null}

        <TicketAttachmentsSection
          entityId={form.draftId}
          value={form.attachments}
          onChange={form.setAttachments}
          disabled={form.create.isPending}
        />

        <SubmitArea
          apiError={form.apiError}
          createError={form.create.error}
          canSubmit={form.canSubmit}
          disableHint={form.disableHint}
          isPending={form.create.isPending}
        />
      </FormStack>
    </form>
  );
}
