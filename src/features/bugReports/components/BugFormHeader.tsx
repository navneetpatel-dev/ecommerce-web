import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import { LABELS } from "@/shared/constants/labels";

interface BugFormHeaderProps {
  canSubmit: boolean;
  disableHint: string;
  isPending: boolean;
}

/** Page header for the new bug report form, incl. desktop submit (Rule 3). */
export function BugFormHeader({
  canSubmit,
  disableHint,
  isPending,
}: BugFormHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1.5">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.newBugReport}
        </h1>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
          {LABELS.newBugReportDescription}
        </p>
      </div>
      <DisabledActionHint disabled={!canSubmit} message={disableHint}>
        <Button
          type="submit"
          className="hidden shrink-0 sm:inline-flex"
          loading={isPending}
          disabled={!canSubmit || isPending}
        >
          {LABELS.bugSubmit}
        </Button>
      </DisabledActionHint>
    </div>
  );
}
