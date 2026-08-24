"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { ReportTable } from "./ReportTable.component";
import { useCustomerOrderHistory } from "../hooks/useCustomerOrderHistory.hook";

export function CustomerOrderHistoryPanel() {
  const history = useCustomerOrderHistory();

  return (
    <div className="mt-10 space-y-5">
      <FormSection title={LABELS.orderHistoryStatement} columns={3}>
        <DateRangeFields
          from={history.from}
          to={history.to}
          onFromChange={history.setFrom}
          onToChange={history.setTo}
          fromId="order-history-from"
          toId="order-history-to"
        />
        <div className="sm:col-span-2 xl:col-span-3">
          <ButtonGroup align="start">
            <Button
              type="button"
              fullWidth="mobile"
              onClick={() => history.load(1)}
              disabled={history.loading}
            >
              {LABELS.loadOrderHistory}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth="mobile"
              onClick={history.exportExcel}
              disabled={history.exporting}
            >
              {LABELS.exportOrderHistory}
            </Button>
          </ButtonGroup>
        </div>
      </FormSection>

      {history.message ? (
        <p className="text-[0.875rem] text-ink-muted" aria-live="polite">
          {history.message}
        </p>
      ) : null}

      {history.result || history.loading || history.error ? (
        <ReportTable
          result={history.result}
          loading={history.loading}
          error={history.error}
          onPageChange={history.setPage}
          onRetry={() => history.load()}
        />
      ) : null}
    </div>
  );
}
