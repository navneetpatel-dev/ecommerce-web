import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { ReportCatalogItem } from "../../api/table/reportsEngine.api";
import { reportTypeSelectStyles as styles } from "./reportTypeSelect.styles";

interface ReportTypeSelectProps {
  catalog: ReportCatalogItem[];
  reportType: string;
  onReportTypeChange: (type: string) => void;
  labelForKey: (key: string) => string;
  disabled: boolean;
  disabledHint: string;
}

/** The report-type picker at the top of the report filter bar. */
export function ReportTypeSelect({
  catalog,
  reportType,
  onReportTypeChange,
  labelForKey,
  disabled,
  disabledHint,
}: ReportTypeSelectProps) {
  const reportTypeItems = catalog.map((item) => (
    <SelectItem key={item.type} value={item.type}>
      {labelForKey(item.labelKey)}
    </SelectItem>
  ));
  const selectedValue = reportType || undefined;

  return (
    <FormFieldFrame
      label={LABELS.reportSelect}
      htmlFor="report-type"
      className={styles.frame}
    >
      <DisabledActionHint disabled={disabled} message={disabledHint} block>
        <Select
          value={selectedValue}
          onValueChange={onReportTypeChange}
          disabled={disabled}
        >
          <SelectTrigger id="report-type" disabled={disabled}>
            <SelectValue placeholder={LABELS.reportSelect} />
          </SelectTrigger>
          <SelectContent>{reportTypeItems}</SelectContent>
        </Select>
      </DisabledActionHint>
    </FormFieldFrame>
  );
}
