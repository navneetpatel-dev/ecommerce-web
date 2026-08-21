import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { AssigneeSelect } from "@/shared/components/AssigneeSelect";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  BUG_AFFECTED_MODULE_VALUES,
  BUG_REPORT_SEVERITY_VALUES,
  type BugAffectedModule,
  type BugReportSeverity,
} from "@/shared/constants/statuses";
import type { BugReport } from "../../api/bugReports.api";
import { BUG_MODULE_LABEL, BUG_SEVERITY_LABEL } from "../../utils/labels";

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
    <section className="relative overflow-hidden border border-line bg-surface shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
      />
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.bugTriage}</TextEyebrow>
      </div>
      <div className="space-y-3 px-4 py-4 sm:px-5">
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
          className="w-full"
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
