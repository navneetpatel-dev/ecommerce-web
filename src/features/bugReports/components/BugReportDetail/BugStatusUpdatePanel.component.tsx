import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { BugReportStatus } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatLabel";
import { BUG_WONT_FIX_REASON_MAX } from "../../constants/fieldLimits";
import { BUG_STATUS_LABEL } from "../../utils/labels";
import { bugReportPanelsStyles } from "./bugReportPanels.styles";

interface BugStatusUpdatePanelProps {
  statusOptions: BugReportStatus[];
  status: BugReportStatus;
  onStatusChange: (value: BugReportStatus) => void;
  updatePending: boolean;
  canMarkDuplicate: boolean;
  duplicateOf: string;
  onDuplicateOfChange: (value: string) => void;
  duplicatePending: boolean;
  canWontFix: boolean;
  wontFixReason: string;
  onWontFixReasonChange: (value: string) => void;
  wontFixPending: boolean;
  actionError: string | null;
  onChangeStatus: () => void;
  onMarkDuplicate: () => void;
  onWontFix: () => void;
}

/** Admin status transitions plus mark-duplicate and won't-fix actions. */
export function BugStatusUpdatePanel(props: BugStatusUpdatePanelProps) {
  const showPanel =
    props.statusOptions.length > 0 ||
    props.canMarkDuplicate ||
    props.canWontFix;

  if (!showPanel) return null;

  return (
    <section className={bugReportPanelsStyles.panelRoot}>
      <div className={bugReportPanelsStyles.panelHeader}>
        <TextEyebrow>{LABELS.bugUpdateStatus}</TextEyebrow>
      </div>
      <div className={bugReportPanelsStyles.panelBodyTight}>
        {props.statusOptions.length > 0 ? (
          <>
            <FormFieldFrame label={LABELS.status}>
              <Select
                value={props.status}
                onValueChange={(v) =>
                  props.onStatusChange(v as BugReportStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {props.statusOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {BUG_STATUS_LABEL[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
            <Button
              type="button"
              variant="outline"
              className={bugReportPanelsStyles.panelFullWidth}
              loading={props.updatePending}
              onClick={props.onChangeStatus}
            >
              {LABELS.bugUpdateStatus}
            </Button>
          </>
        ) : null}

        {props.canMarkDuplicate ? (
          <div className={bugReportPanelsStyles.panelSectionDivider}>
            <FormFieldFrame label={LABELS.bugDuplicateOfId}>
              <Input
                value={props.duplicateOf}
                onChange={(e) => props.onDuplicateOfChange(e.target.value)}
                placeholder={LABELS.bugDuplicateOfPlaceholder}
              />
              <p className={bugReportPanelsStyles.panelHint}>
                {LABELS.bugDuplicateOfHint}
              </p>
            </FormFieldFrame>
            <Button
              type="button"
              variant="outline"
              className={bugReportPanelsStyles.panelButtonMargin}
              loading={props.duplicatePending}
              disabled={!props.duplicateOf.trim()}
              onClick={props.onMarkDuplicate}
            >
              {LABELS.bugMarkDuplicate}
            </Button>
          </div>
        ) : null}

        {props.canWontFix ? (
          <div className={bugReportPanelsStyles.panelSectionDivider}>
            <FormFieldFrame label={LABELS.bugWontFixReason}>
              <Textarea
                value={props.wontFixReason}
                onChange={(e) =>
                  props.onWontFixReasonChange(
                    e.target.value.slice(0, BUG_WONT_FIX_REASON_MAX),
                  )
                }
                rows={3}
                maxLength={BUG_WONT_FIX_REASON_MAX}
              />
              <p className={bugReportPanelsStyles.panelHintTabular}>
                {formatLabel(LABELS.ticketCharCounter, {
                  count: props.wontFixReason.length,
                  max: BUG_WONT_FIX_REASON_MAX,
                })}
              </p>
            </FormFieldFrame>
            <Button
              type="button"
              variant="outline"
              className={bugReportPanelsStyles.panelButtonMargin}
              loading={props.wontFixPending}
              disabled={!props.wontFixReason.trim()}
              onClick={props.onWontFix}
            >
              {LABELS.bugWontFixSubmit}
            </Button>
          </div>
        ) : null}

        {props.actionError ? (
          <FormError
            error={new Error(props.actionError)}
            fallback={LABELS.bugCouldNotUpdate}
          />
        ) : null}
      </div>
    </section>
  );
}
