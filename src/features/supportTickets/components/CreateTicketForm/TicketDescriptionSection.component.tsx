"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { TICKET_DESCRIPTION_MAX } from "../../constants/fieldLimits";
import { createTicketFormStyles } from "./createTicketForm.styles";

type Props = {
  descId: string;
  description: string;
  onDescriptionChange: (value: string) => void;
  descriptionError?: string;
  hasDescriptionError: boolean;
};

export function TicketDescriptionSection({
  descId,
  description,
  onDescriptionChange,
  descriptionError,
  hasDescriptionError,
}: Props) {
  return (
    <FormSection
      title={LABELS.ticketDescriptionSection}
      hint={LABELS.ticketDescriptionSectionHint}
      columns={1}
    >
      <FormFieldFrame
        label={LABELS.ticketDescription}
        htmlFor={descId}
        required
        error={descriptionError}
      >
        <Textarea
          id={descId}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={LABELS.ticketDescriptionPlaceholder}
          rows={8}
          maxLength={TICKET_DESCRIPTION_MAX}
          error={hasDescriptionError}
        />
        <p className={createTicketFormStyles.counterText}>
          {formatLabel(LABELS.ticketCharCounter, {
            count: description.length,
            max: TICKET_DESCRIPTION_MAX,
          })}
        </p>
      </FormFieldFrame>
    </FormSection>
  );
}
