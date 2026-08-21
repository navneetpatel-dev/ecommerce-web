"use client";

import { useEffect } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { PINCODE_LENGTH } from "@/shared/constants/pincode";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { useDeliveryCheck } from "../hooks/useDeliveryCheck";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface ProductDeliveryCheckProps {
  productId: string;
  variantId?: string | null;
  vendorId?: string | null;
  price: number;
  codAvailable?: boolean;
  codMinOrderValue?: number;
  codMaxOrderValue?: number | null;
  onBlockedChange?: (blocked: boolean) => void;
}

export function ProductDeliveryCheck({
  productId,
  variantId,
  vendorId,
  price,
  codAvailable = false,
  codMinOrderValue = 0,
  codMaxOrderValue = null,
  onBlockedChange,
}: ProductDeliveryCheckProps) {
  const delivery = useDeliveryCheck({ productId, variantId, vendorId });
  const {
    pincode,
    setPincode,
    submitted,
    quoteQuery,
    handleCheck,
    isValidPincode,
  } = delivery;
  const pincodeError =
    pincode.length > 0 && !isValidPincode(pincode)
      ? LABELS.invalidPincode
      : null;
  const rates = quoteQuery.data ?? [];
  const fastest = rates.reduce<(typeof rates)[number] | null>((best, rate) => {
    if (!best || rate.estimatedDays < best.estimatedDays) return rate;
    return best;
  }, null);
  const serviceable =
    Boolean(submitted) && !quoteQuery.isFetching && rates.length > 0;
  const notServiceable =
    Boolean(submitted) && !quoteQuery.isFetching && rates.length === 0;
  const inCodRange =
    price >= Number(codMinOrderValue ?? 0) &&
    (codMaxOrderValue == null || price <= Number(codMaxOrderValue));
  const showCod = Boolean(codAvailable && inCodRange);
  const codConfirmed = showCod && serviceable;
  const codBlockedByPincode = showCod && notServiceable;
  const belowCodMin = price < Number(codMinOrderValue ?? 0);

  useEffect(() => {
    onBlockedChange?.(notServiceable);
  }, [notServiceable, onBlockedChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          {LABELS.enterDeliveryPincode}
        </p>
      </div>
      <p className="text-[0.8125rem] leading-snug text-ink-muted">
        {LABELS.deliveryPincodeHint}
      </p>
      <div className="flex flex-wrap gap-2">
        <Input
          inputMode="numeric"
          maxLength={PINCODE_LENGTH}
          value={pincode}
          error={Boolean(pincodeError) || notServiceable}
          onChange={(event) =>
            setPincode(
              event.target.value.replace(/\D/g, "").slice(0, PINCODE_LENGTH),
            )
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleCheck();
            }
          }}
          aria-label={LABELS.enterDeliveryPincode}
          placeholder={LABELS.enterDeliveryPincode}
          autoComplete="postal-code"
          className="w-[8.5rem]"
        />
        <Button
          type="button"
          variant="outline"
          disabled={!isValidPincode(pincode) || quoteQuery.isFetching}
          onClick={handleCheck}
        >
          {LABELS.checkPincode}
        </Button>
      </div>
      {pincodeError ? (
        <p className="text-[0.8125rem] text-danger">{pincodeError}</p>
      ) : null}
      {quoteQuery.isError ? (
        <p className="text-[0.8125rem] text-danger">
          {getApiErrorMessage(quoteQuery.error, LABELS.deliveryCheckFailed)}
        </p>
      ) : null}
      {fastest ? (
        <p className="text-[0.8125rem] leading-snug text-ink-muted">
          {fastest.cost === 0
            ? formatLabel(LABELS.deliveryEtaFree, {
                days: fastest.estimatedDays,
              })
            : formatLabel(LABELS.deliveryEtaWithCost, {
                days: fastest.estimatedDays,
                amount: formatInrAmount(fastest.cost),
              })}
        </p>
      ) : null}
      {notServiceable ? (
        <p className="text-[0.8125rem] leading-snug text-danger">
          {LABELS.deliveryNotServiceable}
        </p>
      ) : !codAvailable ? (
        <p className="text-[0.8125rem] leading-snug text-ink-muted">
          {LABELS.codUnavailable}
        </p>
      ) : !inCodRange ? (
        <p className="text-[0.8125rem] leading-snug text-ink-muted">
          {belowCodMin
            ? formatLabel(LABELS.codMinOrder, {
                amount: formatInrAmount(Number(codMinOrderValue ?? 0)),
              })
            : formatLabel(LABELS.codMaxOrder, {
                amount: formatInrAmount(Number(codMaxOrderValue ?? 0)),
              })}
        </p>
      ) : (
        <>
          <p className="text-[0.8125rem] leading-snug text-ink-muted">
            {codConfirmed
              ? LABELS.codAvailable
              : codBlockedByPincode
                ? LABELS.codUnavailable
                : LABELS.codConfirmPincode}
          </p>
          {Number(codMinOrderValue ?? 0) > 0 ? (
            <p className="text-[0.8125rem] leading-snug text-ink-muted">
              {formatLabel(LABELS.codMinOrder, {
                amount: formatInrAmount(Number(codMinOrderValue)),
              })}
            </p>
          ) : null}
          {codMaxOrderValue != null ? (
            <p className="text-[0.8125rem] leading-snug text-ink-muted">
              {formatLabel(LABELS.codMaxOrder, {
                amount: formatInrAmount(Number(codMaxOrderValue)),
              })}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
