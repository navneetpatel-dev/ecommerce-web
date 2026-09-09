"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  SUPPORT_TICKET_CATEGORY_VALUES,
  type SupportTicketCategory,
} from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { TICKET_SUBJECT_MAX } from "../../../constants/form/fieldLimits";
import { TICKET_CATEGORY_LABEL } from "../../../utils/detail/labels";
import { createTicketFormStyles } from "../../../styles/form/createTicketForm.styles";

type Props = {
  subjectId: string;
  subject: string;
  onSubjectChange: (value: string) => void;
  subjectError?: string;
  hasSubjectError: boolean;
  category: SupportTicketCategory;
  onCategoryChange: (value: SupportTicketCategory) => void;
};

export function TicketBasicsSection({
  subjectId,
  subject,
  onSubjectChange,
  subjectError,
  hasSubjectError,
  category,
  onCategoryChange,
}: Props) {
  return (
    <FormSection
      title={LABELS.ticketBasicsSection}
      hint={LABELS.ticketBasicsSectionHint}
      columns={2}
    >
      <FormFieldFrame
        label={LABELS.ticketSubject}
        htmlFor={subjectId}
        required
        error={subjectError}
      >
        <Input
          id={subjectId}
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder={LABELS.ticketSubjectPlaceholder}
          maxLength={TICKET_SUBJECT_MAX}
          error={hasSubjectError}
        />
        <p className={createTicketFormStyles.counterText}>
          {formatLabel(LABELS.ticketCharCounter, {
            count: subject.length,
            max: TICKET_SUBJECT_MAX,
          })}
        </p>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.ticketCategory} required>
        <Select
          value={category}
          onValueChange={(v) => onCategoryChange(v as SupportTicketCategory)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORT_TICKET_CATEGORY_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {TICKET_CATEGORY_LABEL[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </FormSection>
  );
}
