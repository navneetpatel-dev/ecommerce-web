import {
  useCallback,
  useEffect,
  useMemo,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { PINCODE_LENGTH } from "@/shared/constants/geo/pincode";
import { LABELS } from "@/shared/constants/labels";
import { useDeliveryCheck } from "./useDeliveryCheck.hook";
import { computeDeliveryEligibility } from "../../utils/delivery-check/productDeliveryEligibility";

interface UseProductDeliveryCheckPresentationProps {
  productId: string;
  variantId?: string | null;
  vendorId?: string | null;
  codAvailable?: boolean;
  codEligibleAtUnitPrice?: boolean;
  onBlockedChange?: (blocked: boolean) => void;
}

export function useProductDeliveryCheckPresentation({
  productId,
  variantId,
  vendorId,
  codAvailable = false,
  codEligibleAtUnitPrice = false,
  onBlockedChange,
}: UseProductDeliveryCheckPresentationProps) {
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

  const rates = useMemo(() => quoteQuery.data ?? [], [quoteQuery.data]);

  const eligibility = useMemo(
    () =>
      computeDeliveryEligibility({
        rates,
        submitted: Boolean(submitted),
        isFetching: quoteQuery.isFetching,
        codAvailable,
        codEligibleAtUnitPrice,
      }),
    [
      rates,
      submitted,
      quoteQuery.isFetching,
      codAvailable,
      codEligibleAtUnitPrice,
    ],
  );

  const { notServiceable } = eligibility;

  useEffect(() => {
    onBlockedChange?.(notServiceable);
  }, [notServiceable, onBlockedChange]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPincode(
        event.target.value.replace(/\D/g, "").slice(0, PINCODE_LENGTH),
      );
    },
    [setPincode],
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCheck();
      }
    },
    [handleCheck],
  );

  const isCheckDisabled = !isValidPincode(pincode) || quoteQuery.isFetching;

  return {
    pincode,
    pincodeError,
    quoteQuery,
    eligibility,
    handleCheck,
    handleInputChange,
    handleInputKeyDown,
    isCheckDisabled,
  };
}
