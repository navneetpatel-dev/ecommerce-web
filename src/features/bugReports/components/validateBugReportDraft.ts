import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from "../constants/fieldLimits";

export type BugReportField = "title" | "description" | "steps" | "attachments";

export interface BugReportDraftValues {
  title: string;
  description: string;
  steps: string;
  /** True when any attachment is missing its bug-type classification. */
  hasUntypedAttachment: boolean;
}

export type BugReportFieldErrors = Partial<Record<BugReportField, string>>;

/** Validates the bug report draft against field limits and required rules. */
export function validateBugReportDraft(
  values: BugReportDraftValues,
): BugReportFieldErrors {
  const trimmedTitle = values.title.trim();
  const trimmedDescription = values.description.trim();
  const trimmedSteps = values.steps.trim();
  const nextErrors: BugReportFieldErrors = {};

  if (!trimmedTitle) {
    nextErrors.title = LABELS.bugTitleRequired;
  } else if (trimmedTitle.length > BUG_TITLE_MAX) {
    nextErrors.title = formatLabel(LABELS.bugTitleTooLong, {
      max: String(BUG_TITLE_MAX),
    });
  }

  if (!trimmedDescription) {
    nextErrors.description = LABELS.bugDescriptionRequired;
  } else if (trimmedDescription.length > BUG_DESCRIPTION_MAX) {
    nextErrors.description = formatLabel(LABELS.bugDescriptionTooLong, {
      max: String(BUG_DESCRIPTION_MAX),
    });
  }

  if (trimmedSteps.length > BUG_STEPS_MAX) {
    nextErrors.steps = formatLabel(LABELS.bugStepsTooLong, {
      max: String(BUG_STEPS_MAX),
    });
  }

  if (values.hasUntypedAttachment) {
    nextErrors.attachments = LABELS.bugAttachmentTypeMissing;
  }

  return nextErrors;
}
