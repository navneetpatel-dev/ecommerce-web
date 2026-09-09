import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { bugReportFormStyles } from "./bugReportForm.styles";

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
    <div className={bugReportFormStyles.header}>
      <div className={bugReportFormStyles.headerTitleWrap}>
        <h1 className={bugReportFormStyles.headerTitle}>
          {LABELS.newBugReport}
        </h1>
        <p className={bugReportFormStyles.headerDesc}>
          {LABELS.newBugReportDescription}
        </p>
      </div>
      <DisabledActionHint disabled={!canSubmit} message={disableHint}>
        <Button
          type="submit"
          className={bugReportFormStyles.headerSubmitBtn}
          loading={isPending}
          disabled={!canSubmit || isPending}
        >
          {LABELS.bugSubmit}
        </Button>
      </DisabledActionHint>
    </div>
  );
}
