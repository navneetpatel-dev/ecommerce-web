import { useCallback, useState, type FormEvent } from "react";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  adminShippingApi,
  type CreateShippingRateBody,
} from "@/features/admin-dashboard/api/shipping/shipping.api";

/** Create-shipping-rate form state, split out to keep useAdminShippingRatesPage under the line ceiling. */
export function useShippingRateForm(onCreated: () => void) {
  const [zoneId, setZoneId] = useState("");
  const [method, setMethod] = useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [minWeightGrams, setMinWeightGrams] = useState("0");
  const [maxWeightGrams, setMaxWeightGrams] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (
        !zoneId ||
        !maxWeightGrams.trim() ||
        !price.trim() ||
        !estimatedDays.trim()
      ) {
        return;
      }
      setCreateError(null);
      const body: CreateShippingRateBody = {
        zoneId,
        method,
        maxWeightGrams: Number(maxWeightGrams),
        price: Number(price),
        estimatedDays: Number(estimatedDays),
      };
      if (minWeightGrams.trim()) body.minWeightGrams = Number(minWeightGrams);
      if (freeShippingThreshold.trim()) {
        body.freeShippingThreshold = Number(freeShippingThreshold);
      }
      if (vendorId.trim()) body.vendorId = vendorId.trim();

      try {
        await adminShippingApi.createRate(body);
        setMaxWeightGrams("");
        setPrice("");
        setEstimatedDays("");
        setFreeShippingThreshold("");
        setVendorId("");
        setMinWeightGrams("0");
        onCreated();
      } catch (err) {
        setCreateError(
          getApiErrorMessage(
            err,
            shippingRatesLabels.couldNotCreateShippingRate,
          ),
        );
      }
    },
    [
      zoneId,
      method,
      minWeightGrams,
      maxWeightGrams,
      price,
      estimatedDays,
      freeShippingThreshold,
      vendorId,
      onCreated,
    ],
  );

  return {
    zoneId,
    method,
    minWeightGrams,
    maxWeightGrams,
    price,
    estimatedDays,
    freeShippingThreshold,
    vendorId,
    createError,
    onZoneIdChange: setZoneId,
    onMethodChange: setMethod,
    onMinWeightGramsChange: setMinWeightGrams,
    onMaxWeightGramsChange: setMaxWeightGrams,
    onPriceChange: setPrice,
    onEstimatedDaysChange: setEstimatedDays,
    onFreeShippingThresholdChange: setFreeShippingThreshold,
    onVendorIdChange: setVendorId,
    onSubmit,
  };
}
