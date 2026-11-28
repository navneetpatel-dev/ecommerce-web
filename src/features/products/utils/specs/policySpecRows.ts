import { LABELS } from "@/shared/constants/labels";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type {
  SpecRow,
  UseProductSpecificationsParams,
} from "../../types/specs/specifications.types";
import { pushUniqueRow } from "./pushSpecRow";

/** Warranty, returns, delivery, cash on delivery and HSN code. */
export function addPolicyRows(
  list: SpecRow[],
  seenLabels: Set<string>,
  {
    hsnCode,
    warrantyMonths,
    warrantyType,
    returnsAllowed,
    returnWindowDays,
    returnNote,
    deliveryNote,
    codAvailable,
  }: UseProductSpecificationsParams,
) {
  // 4. Policy, warranty, return and delivery specifications from admin/vendor
  if (warrantyMonths != null && warrantyMonths > 0) {
    const typeText =
      warrantyType === WARRANTY_TYPE.SELLER
        ? LABELS.warrantySeller
        : LABELS.warrantyManufacturer;
    pushUniqueRow(
      list,
      seenLabels,
      LABELS.warranty,
      formatLabel(LABELS.warrantyMonthsLabel, {
        months: warrantyMonths,
        type: typeText,
      }),
    );
  }

  if (returnsAllowed === false) {
    pushUniqueRow(list, seenLabels, LABELS.returnsPolicy, LABELS.notReturnable);
  } else if (typeof returnWindowDays === "number") {
    const returnText = formatLabel(LABELS.easyReturnsDays, {
      days: returnWindowDays,
    });
    pushUniqueRow(
      list,
      seenLabels,
      LABELS.returnsPolicy,
      returnNote?.trim() ? `${returnText} · ${returnNote.trim()}` : returnText,
    );
  } else if (returnNote?.trim()) {
    pushUniqueRow(list, seenLabels, LABELS.returnsPolicy, returnNote.trim());
  }

  if (deliveryNote?.trim()) {
    pushUniqueRow(
      list,
      seenLabels,
      LABELS.deliveryAreaHeading,
      deliveryNote.trim(),
    );
  }

  if (typeof codAvailable === "boolean") {
    pushUniqueRow(
      list,
      seenLabels,
      LABELS.cashOnDelivery,
      codAvailable ? LABELS.codAvailable : LABELS.codUnavailable,
    );
  }

  if (hsnCode?.trim() && !/default/i.test(hsnCode)) {
    pushUniqueRow(list, seenLabels, LABELS.hsnCode, hsnCode.trim());
  }
}
