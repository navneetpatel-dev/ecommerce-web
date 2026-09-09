import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { AssigneeSelect } from "@/shared/components/AssigneeSelect.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import {
  BUG_AFFECTED_MODULE_VALUES,
  BUG_REPORT_SEVERITY_VALUES,
  type BugAffectedModule,
  type BugReportSeverity,
} from "@/shared/constants/statuses";
import type { BugReport } from "../../../api/list/bugReports.api";
import { BUG_MODULE_LABEL, BUG_SEVERITY_LABEL } from "../../../utils/detail/labels";
import { bugReportPanelsStyles } from "../../../styles/detail/bugReportPanels.styles";

interface BugTriagePanelProps {
  report: BugReport;
  severity: BugReportSeverity;
  onSeverityChange: (value: BugReportSeverity) => void;
  module: BugAffectedModule;
  onModuleChange: (value: BugAffectedModule) => void;
  assigneeId: string;
  onAssigneeChange: (value: string) => void;
  assignmentError: string | null;
  savePending: boolean;
  canEditAssignment: boolean;
  isNewReport: boolean;
  onSave: () => void;
}

/** Admin triage form: severity, affected module and assignee. */
export function BugTriagePanel(props: BugTriagePanelProps) {
  const { report } = props;

  return (
    <section className={bugReportPanelsStyles.panelRootWithBar}>
      <div aria-hidden className={bugReportPanelsStyles.panelAccentBar} />
      <div className={bugReportPanelsStyles.panelHeader}>
        <TextEyebrow brand>{LABELS.bugTriage}</TextEyebrow>
      </div>
      <div className={bugReportPanelsStyles.panelBodyTight}>
        <FormFieldFrame label={LABELS.bugSeverity}>
          <Select
            value={props.severity}
            onValueChange={(v) =>
              props.onSeverityChange(v as BugReportSeverity)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUG_REPORT_SEVERITY_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {BUG_SEVERITY_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.bugAffectedModule}>
          <Select
            value={props.module}
            onValueChange={(v) => props.onModuleChange(v as BugAffectedModule)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUG_AFFECTED_MODULE_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {BUG_MODULE_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.bugAssignToId}>
          <AssigneeSelect
            permission={PERMISSIONS.BUG_REPORT_MANAGE}
            value={props.assigneeId}
            onChange={props.onAssigneeChange}
            allowNone
            noneLabel={LABELS.bugAssigneeNone}
            currentOption={
              report.assignedToId
                ? {
                    id: report.assignedToId,
                    name: report.assignedToName || report.assignedToId,
                  }
                : null
            }
          />
        </FormFieldFrame>
        <FormError
          error={
            props.assignmentError ? new Error(props.assignmentError) : null
          }
          fallback={LABELS.bugCouldNotSaveAssignment}
        />
        <Button
          type="button"
          className={bugReportPanelsStyles.panelFullWidth}
          loading={props.savePending}
          disabled={!props.canEditAssignment}
          onClick={props.onSave}
        >
          {props.isNewReport
            ? LABELS.bugTriageSubmit
            : LABELS.bugSaveAssignment}
        </Button>
      </div>
    </section>
  );
}
