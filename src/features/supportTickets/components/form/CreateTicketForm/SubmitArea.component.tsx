"use client";

import { FormActions, FormSection } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  TicketAttachmentUploader,
  type UploadedMediaAttachment,
} from "../TicketAttachmentUploader/index";

type AttachmentsProps = {
  entityId: string;
  value: UploadedMediaAttachment[];
  onChange: (value: UploadedMediaAttachment[]) => void;
  disabled: boolean;
};

export function TicketAttachmentsSection({
  entityId,
  value,
  onChange,
  disabled,
}: AttachmentsProps) {
  return (
    <FormSection
      title={LABELS.ticketAttachmentsSection}
      hint={LABELS.ticketAttachmentsSectionHint}
      columns={1}
    >
      <TicketAttachmentUploader
        entityId={entityId}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </FormSection>
  );
}

type SubmitProps = {
  apiError: string | null;
  createError: unknown;
  canSubmit: boolean;
  disableHint: string;
  isPending: boolean;
};

export function SubmitArea({
  apiError,
  createError,
  canSubmit,
  disableHint,
  isPending,
}: SubmitProps) {
  return (
    <>
      <FormError
        error={apiError ? new Error(apiError) : (createError as Error | null)}
        fallback={LABELS.ticketCouldNotCreate}
      />
      <FormActions>
        <DisabledActionHint disabled={!canSubmit} message={disableHint}>
          <Button
            type="submit"
            fullWidth="mobile"
            loading={isPending}
            disabled={!canSubmit || isPending}
          >
            {LABELS.ticketSubmit}
          </Button>
        </DisabledActionHint>
      </FormActions>
    </>
  );
}
