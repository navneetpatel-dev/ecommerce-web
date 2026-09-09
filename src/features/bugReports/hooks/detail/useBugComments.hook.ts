"use client";

import { useMemo, useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import {
  useAddBugComment,
  useBugCommentsInfinite,
} from "../../api/list/bugReports.queries";
import type { BugReport } from "../../api/list/bugReports.api";

/** Owns the internal bug-report comments thread and composer state (Rule 12). */
export function useBugComments(report: BugReport, enabled: boolean) {
  const commentsQuery = useBugCommentsInfinite(report.id, { enabled });
  const addComment = useAddBugComment(report.id);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const comments = useMemo(
    () =>
      commentsQuery.data?.pages.flatMap((p) => p.items) ??
      report.comments ??
      [],
    [commentsQuery.data, report.comments],
  );

  const onAddComment = async () => {
    setError(null);
    try {
      await addComment.mutateAsync(comment.trim());
      setComment("");
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.bugCouldNotComment));
    }
  };

  return {
    comment,
    setComment,
    error,
    comments,
    commentsQuery,
    addComment,
    onAddComment,
  };
}
