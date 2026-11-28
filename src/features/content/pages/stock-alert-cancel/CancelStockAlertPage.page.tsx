"use client";

import {
  UnsubscribeView,
  type UnsubscribeCopy,
} from "../../components/unsubscribe/UnsubscribeView.component";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";
import { PATHS } from "@/shared/constants/paths/paths";
import { useCancelStockAlertPage } from "../../hooks/stock-alert-cancel/useCancelStockAlertPage.hook";

const COPY: UnsubscribeCopy = {
  heading: stockAlertsLabels.cancelHeading,
  body: stockAlertsLabels.cancelBody,
  confirm: stockAlertsLabels.cancelConfirm,
  doneHeading: stockAlertsLabels.cancelDoneHeading,
  doneBody: stockAlertsLabels.cancelDoneBody,
  invalid: stockAlertsLabels.cancelInvalid,
  failed: stockAlertsLabels.cancelFailed,
  linkLabel: stockAlertsLabels.cancelGoShopping,
  linkHref: PATHS.products,
};

export function CancelStockAlertPage() {
  const page = useCancelStockAlertPage();
  return (
    <UnsubscribeView
      copy={COPY}
      hasToken={page.hasToken}
      isPending={page.isPending}
      isDone={page.isDone}
      error={page.error}
      onConfirm={page.handleConfirm}
    />
  );
}
