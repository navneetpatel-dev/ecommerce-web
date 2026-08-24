"use client";

import { useId, useMemo } from "react";
import { FormSection, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from "../constants/fieldLimits";
import { useBugReportForm } from "../hooks/useBugReportForm.hook";
import { BugFormHeader } from "./BugFormHeader.component";
import { CharCountedField } from "./BugFormFields.component";
import { BugFormFooter } from "./BugFormFooter.component";

type Props = {
  successHref: (id: string) => string;
  /** When true, omit the page H1 (parent already renders one). */
  hideTitle?: boolean;
};

export function BugReportForm(props: Props) {
  const { successHref, hideTitle = false } = props;
  const draftId = useMemo(() => crypto.randomUUID(), []);

  const titleId = useId();
  const descId = useId();
  const stepsId = useId();

  const form = useBugReportForm({ successHref });
  const values = form.form.watch();
  const attachments = form.attachments;

  const renderCharCounter = (count: number, max: number) => (
    <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
      {formatLabel(LABELS.ticketCharCounter, { count, max })}
    </p>
  );

  return (
    <form onSubmit={form.onSubmit} className="w-full min-w-0">
      <FormStack className="space-y-8">
        {hideTitle ? null : (
          <BugFormHeader
            canSubmit={form.canSubmit}
            disableHint={form.disableHint}
            isPending={form.create.isPending}
          />
        )}

        <FormSection
          title={LABELS.bugBasicsSection}
          hint={LABELS.bugBasicsSectionHint}
          columns={1}
        >
          <CharCountedField
            id={titleId}
            label={LABELS.bugTitle}
            required
            value={values.title}
            onChange={form.updateTitle}
            placeholder={LABELS.bugTitlePlaceholder}
            maxLength={BUG_TITLE_MAX}
            error={form.errorFor("title")}
            hasError={Boolean(form.errorFor("title"))}
            counter={renderCharCounter(values.title.length, BUG_TITLE_MAX)}
          />
        </FormSection>

        <FormSection
          title={LABELS.bugDescriptionSection}
          hint={LABELS.bugDescriptionSectionHint}
          columns={2}
        >
          <CharCountedField
            id={descId}
            label={LABELS.bugDescription}
            required
            value={values.description}
            onChange={form.updateDescription}
            placeholder={LABELS.bugDescriptionPlaceholder}
            multilineRows={6}
            maxLength={BUG_DESCRIPTION_MAX}
            error={form.errorFor("description")}
            hasError={Boolean(form.errorFor("description"))}
            counter={renderCharCounter(
              values.description.length,
              BUG_DESCRIPTION_MAX,
            )}
          />
          <CharCountedField
            id={stepsId}
            label={LABELS.bugStepsToReproduce}
            value={values.steps}
            onChange={form.updateSteps}
            placeholder={LABELS.bugStepsPlaceholder}
            multilineRows={5}
            maxLength={BUG_STEPS_MAX}
            error={form.errorFor("steps")}
            hasError={Boolean(form.errorFor("steps"))}
            counter={renderCharCounter(values.steps.length, BUG_STEPS_MAX)}
          />
        </FormSection>

        <BugFormFooter
          draftId={draftId}
          attachments={attachments}
          onAttachmentsChange={(next) => {
            form.clearAttachmentErrors();
            form.setAttachments(next);
          }}
          attachmentError={form.errorFor("attachments")}
          isPending={form.create.isPending}
          canSubmit={form.canSubmit}
          disableHint={form.disableHint}
          apiError={form.apiError}
          mutationError={(form.create.error as Error | null) ?? null}
        />
      </FormStack>
    </form>
  );
}
