"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/useApiFormErrors.hook";
import { readLastBrowseUrl } from "@/shared/utils/lastBrowseUrl";
import { BugReportSchema } from "../schemas/bugReport.schema";
import { useCreateBugReport } from "../api/bugReports.queries";
import type { UploadedMediaAttachment } from "@/features/supportTickets";
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from "../constants/fieldLimits";

export interface UseBugReportFormParams {
  /** Builds the post-submit redirect target from the created bug id. */
  successHref: (id: string) => string;
}

/**
 * Owns the bug report form state (Rule 22): RHF + zod schema, attachment
 * list, and submit flow. The view receives named bindings and errors only.
 */
export function useBugReportForm(params: UseBugReportFormParams) {
  const { successHref } = params;
  const router = useRouter();
  const create = useCreateBugReport();
  const [clientError, setClientError] = useState<string | null>(null);
  const capturedPageUrl = useRef(readLastBrowseUrl());

  const [attachments, setAttachmentsState] = useState<
    UploadedMediaAttachment[]
  >([]);

  const form = useForm<{
    title: string;
    description: string;
    steps: string;
  }>({
    resolver: zodResolver(BugReportSchema.omit({ attachments: true })),
    mode: "onChange",
    defaultValues: { title: "", description: "", steps: "" },
  });

  const title = form.watch("title");
  const description = form.watch("description");

  // Submit stays enabled once the required text is present — the full
  // schema (incl. attachment typing) is enforced on submit, matching UX.
  const canSubmit = Boolean(title.trim()) && Boolean(description.trim());
  const disableHint = canSubmit
    ? ""
    : !title.trim()
      ? LABELS.enterBugTitle
      : LABELS.enterBugDescription;

  const setField =
    (field: "title" | "description" | "steps", max: number) =>
    (value: string) =>
      form.setValue(field, value.slice(0, max), { shouldValidate: true });

  const updateTitle = setField("title", BUG_TITLE_MAX);
  const updateDescription = setField("description", BUG_DESCRIPTION_MAX);
  const updateSteps = setField("steps", BUG_STEPS_MAX);

  const setAttachments = (next: UploadedMediaAttachment[]) =>
    setAttachmentsState(next);
  const clearAttachmentErrors = () => {};

  const errorFor = (
    field: "title" | "description" | "steps" | "attachments",
  ): string | undefined => {
    if (field === "attachments") {
      return attachments.some((a) => !a.bugType)
        ? LABELS.bugAttachmentTypeMissing
        : undefined;
    }
    return form.formState.errors[field]?.message as string | undefined;
  };

  const { formLevelError } = useApiFormErrors(
    form,
    create.error,
    LABELS.bugCouldNotCreate,
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setClientError(null);
    create.reset();
    // Full-schema validation incl. attachment classification (Rule 16).
    const parsed = BugReportSchema.safeParse({
      ...values,
      attachments: attachments.map((a) => ({
        url: a.url,
        type: a.bugType ?? null,
        durationSeconds: a.durationSeconds,
      })),
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message;
      if (first) setClientError(first);
      return;
    }
    try {
      const bug = await create.mutateAsync({
        body: {
          title: values.title,
          description: values.description,
          stepsToReproduce: values.steps || null,
          attachmentUrls: parsed.data.attachments.map((a) => ({
            url: a.url,
            type: a.type,
            durationSeconds: a.durationSeconds,
          })),
        },
        pageUrl: capturedPageUrl.current,
      });
      router.push(successHref(bug.id));
    } catch {
      // Field + form-level errors come from create.error via useApiFormErrors.
    }
  });

  return {
    form,
    attachments,
    canSubmit,
    disableHint,
    updateTitle,
    updateDescription,
    updateSteps,
    setAttachments,
    clearAttachmentErrors,
    errorFor,
    onSubmit,
    apiError: clientError ?? formLevelError,
    create,
  };
}
