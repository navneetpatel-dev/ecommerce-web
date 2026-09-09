import { FormActions, FormSection } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  BugAttachmentUploader,
  type UploadedMediaAttachment,
} from "@/features/supportTickets";
import { bugReportFormStyles } from "../../styles/form/bugReportForm.styles";

interface BugFormFooterProps {
  draftId: string;
  attachments: UploadedMediaAttachment[];
  onAttachmentsChange: (next: UploadedMediaAttachment[]) => void;
  attachmentError?: string;
  isPending: boolean;
  canSubmit: boolean;
  disableHint: string;
  apiError: string | null;
}

/** Attachments section + error/submit footer of the bug report form (Rule 3). */
export function BugFormFooter(props: BugFormFooterProps) {
  const {
    draftId,
    attachments,
    onAttachmentsChange,
    attachmentError,
    isPending,
    canSubmit,
    disableHint,
    apiError,
  } = props;

  return (
    <>
      <FormSection
        title={LABELS.bugAttachmentsSection}
        hint={LABELS.bugAttachmentsSectionHint}
        columns={1}
      >
        <BugAttachmentUploader
          entityId={draftId}
          value={attachments}
          onChange={onAttachmentsChange}
          disabled={isPending}
        />
        {attachmentError ? (
          <p role="alert" className={bugReportFormStyles.footerAttachmentError}>
            {attachmentError}
          </p>
        ) : null}
      </FormSection>

      <FormError error={apiError} fallback={LABELS.bugCouldNotCreate} />
      <FormActions>
        <DisabledActionHint disabled={!canSubmit} message={disableHint}>
          <Button
            type="submit"
            fullWidth="mobile"
            loading={isPending}
            disabled={!canSubmit || isPending}
          >
            {LABELS.bugSubmit}
          </Button>
        </DisabledActionHint>
      </FormActions>
    </>
  );
}
