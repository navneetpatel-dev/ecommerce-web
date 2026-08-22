"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormSection, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/useManualFormFieldErrors";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";
import { readLastBrowseUrl } from "@/shared/utils/lastBrowseUrl";
import type { UploadedMediaAttachment } from "@/features/supportTickets";
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from "../constants/fieldLimits";
import { useCreateBugReport } from "../api/bugReports.queries";
import {
  validateBugReportDraft,
  type BugReportField,
} from "./validateBugReportDraft";
import { BugFormHeader } from "./BugFormHeader";
import { CharCountedField } from "./BugFormFields";
import { BugFormFooter } from "./BugFormFooter";

type Props = {
  successHref: (id: string) => string;
  /** When true, omit the page H1 (parent already renders one). */
  hideTitle?: boolean;
};

export function BugReportForm({ successHref, hideTitle = false }: Props) {
  const router = useRouter();
  const draftId = useMemo(() => crypto.randomUUID(), []);
  const capturedPageUrl = useRef(readLastBrowseUrl());
  const create = useCreateBugReport();

  const titleId = useId();
  const descId = useId();
  const stepsId = useId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const { clearAll, clearField, setErrors, getError, hasError } =
    useManualFormFieldErrors<BugReportField>();

  const requiredChecks = useMemo(
    () => [
      { ok: Boolean(title.trim()), message: LABELS.enterBugTitle },
      { ok: Boolean(description.trim()), message: LABELS.enterBugDescription },
    ],
    [title, description],
  );
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";

  const updateTitle = (value: string) => {
    clearField("title");
    setTitle(value.slice(0, BUG_TITLE_MAX));
  };

  const updateDescription = (value: string) => {
    clearField("description");
    setDescription(value.slice(0, BUG_DESCRIPTION_MAX));
  };

  const updateSteps = (value: string) => {
    clearField("steps");
    setSteps(value.slice(0, BUG_STEPS_MAX));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    clearAll();

    const nextErrors = validateBugReportDraft({
      title,
      description,
      steps,
      hasUntypedAttachment: attachments.some((a) => !a.bugType),
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const bug = await create.mutateAsync({
        body: {
          title: title.trim().slice(0, BUG_TITLE_MAX),
          description: description.trim().slice(0, BUG_DESCRIPTION_MAX),
          stepsToReproduce: steps.trim().slice(0, BUG_STEPS_MAX) || null,
          attachmentUrls: attachments.map((a) => ({
            url: a.url,
            type: a.bugType!,
            durationSeconds: a.durationSeconds,
          })),
        },
        pageUrl: capturedPageUrl.current,
      });
      router.push(successHref(bug.id));
    } catch (err) {
      setApiError(getApiErrorMessage(err, LABELS.bugCouldNotCreate));
    }
  };

  const renderCharCounter = (count: number, max: number) => (
    <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
      {formatLabel(LABELS.ticketCharCounter, { count, max })}
    </p>
  );

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0">
      <FormStack className="space-y-8">
        {hideTitle ? null : (
          <BugFormHeader
            canSubmit={canSubmit}
            disableHint={disableHint}
            isPending={create.isPending}
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
            value={title}
            onChange={updateTitle}
            placeholder={LABELS.bugTitlePlaceholder}
            maxLength={BUG_TITLE_MAX}
            error={getError("title")}
            hasError={hasError("title")}
            counter={renderCharCounter(title.length, BUG_TITLE_MAX)}
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
            value={description}
            onChange={updateDescription}
            placeholder={LABELS.bugDescriptionPlaceholder}
            multilineRows={6}
            maxLength={BUG_DESCRIPTION_MAX}
            error={getError("description")}
            hasError={hasError("description")}
            counter={renderCharCounter(description.length, BUG_DESCRIPTION_MAX)}
          />
          <CharCountedField
            id={stepsId}
            label={LABELS.bugStepsToReproduce}
            value={steps}
            onChange={updateSteps}
            placeholder={LABELS.bugStepsPlaceholder}
            multilineRows={5}
            maxLength={BUG_STEPS_MAX}
            error={getError("steps")}
            hasError={hasError("steps")}
            counter={renderCharCounter(steps.length, BUG_STEPS_MAX)}
          />
        </FormSection>

        <BugFormFooter
          draftId={draftId}
          attachments={attachments}
          onAttachmentsChange={(next) => {
            clearField("attachments");
            setAttachments(next);
          }}
          attachmentError={getError("attachments") ?? undefined}
          isPending={create.isPending}
          canSubmit={canSubmit}
          disableHint={disableHint}
          apiError={apiError}
          mutationError={(create.error as Error | null) ?? null}
        />
      </FormStack>
    </form>
  );
}
