"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { ReportTable } from "../table/ReportTable.component";
import { useCustomerOrderHistory } from "../../hooks/customer-order-history/useCustomerOrderHistory.hook";
import { customerOrderHistoryPanelStyles as styles } from "../../styles/customer-order-history/customerOrderHistoryPanel.styles";

export function CustomerOrderHistoryPanel() {
  const history = useCustomerOrderHistory();
  const filterHint = exportFilterDisableHint({
    message: history.message,
    exportingFormat: history.exportingFormat,
    controlsDisabled: history.controlsDisabled,
  });
  const loadButtonDisabled = history.loading || history.controlsDisabled;
  const loadButtonHint = history.controlsDisabled ? filterHint : "";
  const hasHistoryContent = Boolean(
    history.result || history.loading || history.error,
  );
  const historyTable = hasHistoryContent ? (
    <ReportTable
      result={history.result}
      loading={history.loading}
      error={history.error}
      onPageChange={history.setPage}
      onRetry={() => history.load()}
    />
  ) : null;

  return (
    <div className={styles.container}>
      <FormSection title={LABELS.orderHistoryStatement} columns={3}>
        <DateRangeFields
          from={history.from}
          to={history.to}
          onFromChange={history.setFrom}
          onToChange={history.setTo}
          fromId="order-history-from"
          toId="order-history-to"
          disabled={history.controlsDisabled}
          disabledHint={filterHint}
        />
        <div className={styles.actionsWrapper}>
          <ButtonGroup align="start">
            <DisabledActionHint
              disabled={loadButtonDisabled}
              message={loadButtonHint}
              block
              className={styles.buttonHint}
            >
              <Button
                type="button"
                fullWidth="mobile"
                onClick={() => history.load(1)}
                disabled={loadButtonDisabled}
              >
                {LABELS.loadOrderHistory}
              </Button>
            </DisabledActionHint>
            <ReportExportButtons
              grouped={false}
              controlsDisabled={history.controlsDisabled}
              exportingFormat={history.exportingFormat}
              statusMessage={history.message}
              onExportExcel={history.exportExcel}
              onExportCsv={history.exportCsv}
              onExportPdf={history.exportPdf}
            />
          </ButtonGroup>
          <ReportExportStatus
            message={history.message}
            error={history.error}
            exportingFormat={history.exportingFormat}
            controlsDisabled={history.controlsDisabled}
          />
        </div>
      </FormSection>

      {historyTable}
    </div>
  );
}
