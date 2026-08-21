"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { PINCODE_LENGTH, PINCODE_PATTERN } from "@/shared/constants/pincode";
import { checkoutApi } from "@/features/checkout";
import { checkoutKeys } from "@/features/checkout";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

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
  const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState("");

  const quoteQuery = useQuery({
    queryKey: checkoutKeys.pdpShippingRates(submitted, productId, variantId),
    queryFn: () =>
      checkoutApi.getShippingRates(submitted, undefined, {
        productId,
        variantId: variantId ?? undefined,
        vendorId: vendorId ?? undefined,
      }),
    enabled: PINCODE_PATTERN.test(submitted),
  });

  const handleCheck = () => {
    const next = pincode.trim();
    if (!PINCODE_PATTERN.test(next)) return;
    setSubmitted(next);
  };

  const pincodeError =
    pincode.length > 0 && !PINCODE_PATTERN.test(pincode.trim())
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
          disabled={
            !PINCODE_PATTERN.test(pincode.trim()) || quoteQuery.isFetching
          }
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
                amount: fastest.cost.toLocaleString("en-IN"),
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
                amount: Number(codMinOrderValue ?? 0).toLocaleString("en-IN"),
              })
            : formatLabel(LABELS.codMaxOrder, {
                amount: Number(codMaxOrderValue ?? 0).toLocaleString("en-IN"),
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
                amount: Number(codMinOrderValue).toLocaleString("en-IN"),
              })}
            </p>
          ) : null}
          {codMaxOrderValue != null ? (
            <p className="text-[0.8125rem] leading-snug text-ink-muted">
              {formatLabel(LABELS.codMaxOrder, {
                amount: Number(codMaxOrderValue).toLocaleString("en-IN"),
              })}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
