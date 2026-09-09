import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { DeliveryEligibility } from "../../../utils/delivery-check/productDeliveryEligibility";
import { productDeliveryCheckStyles } from "../../../styles/delivery-check/productDeliveryCheck.styles";

interface ProductDeliveryEligibilityNoticeProps {
  eligibility: DeliveryEligibility;
  codAvailable: boolean;
  codEligibleAtUnitPrice: boolean;
  codMinOrderValue: number;
  codMaxOrderValue: number | null;
}

export function ProductDeliveryEligibilityNotice({
  eligibility,
  codAvailable,
  codEligibleAtUnitPrice,
  codMinOrderValue,
  codMaxOrderValue,
}: ProductDeliveryEligibilityNoticeProps) {
  const {
    fastest,
    notServiceable,
    codConfirmed,
    codBlockedByPincode,
    belowCodMin,
  } = eligibility;

  const minOrderAmountFormatted = formatInrAmount(
    Number(codMinOrderValue ?? 0),
  );
  const maxOrderAmountFormatted = formatInrAmount(
    Number(codMaxOrderValue ?? 0),
  );

  const etaLabel = fastest
    ? fastest.shippingDisplayKey === "FREE"
      ? formatLabel(LABELS.deliveryEtaFree, {
          days: fastest.estimatedDays,
        })
      : formatLabel(LABELS.deliveryEtaWithCost, {
          days: fastest.estimatedDays,
          amount: formatInrAmount(fastest.cost),
        })
    : null;

  const belowMinText = belowCodMin
    ? formatLabel(LABELS.codMinOrder, { amount: minOrderAmountFormatted })
    : formatLabel(LABELS.codMaxOrder, { amount: maxOrderAmountFormatted });

  const codConfirmationText = codConfirmed
    ? LABELS.codAvailable
    : codBlockedByPincode
      ? LABELS.codUnavailable
      : LABELS.codConfirmPincode;

  return (
    <>
      {etaLabel ? (
        <p className={productDeliveryCheckStyles.noticeMuted}>{etaLabel}</p>
      ) : null}
      {notServiceable ? (
        <p className={productDeliveryCheckStyles.noticeDanger}>
          {LABELS.deliveryNotServiceable}
        </p>
      ) : !codAvailable ? (
        <p className={productDeliveryCheckStyles.noticeMuted}>
          {LABELS.codUnavailable}
        </p>
      ) : !codEligibleAtUnitPrice ? (
        <p className={productDeliveryCheckStyles.noticeMuted}>{belowMinText}</p>
      ) : (
        <>
          <p className={productDeliveryCheckStyles.noticeMuted}>
            {codConfirmationText}
          </p>
          {Number(codMinOrderValue ?? 0) > 0 ? (
            <p className={productDeliveryCheckStyles.noticeMuted}>
              {formatLabel(LABELS.codMinOrder, {
                amount: minOrderAmountFormatted,
              })}
            </p>
          ) : null}
          {codMaxOrderValue != null ? (
            <p className={productDeliveryCheckStyles.noticeMuted}>
              {formatLabel(LABELS.codMaxOrder, {
                amount: maxOrderAmountFormatted,
              })}
            </p>
          ) : null}
        </>
      )}
    </>
  );
}
