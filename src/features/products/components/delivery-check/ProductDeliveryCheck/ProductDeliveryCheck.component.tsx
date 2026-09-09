"use client";

import { Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { PINCODE_LENGTH } from "@/shared/constants/geo/pincode";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { productDeliveryCheckStyles } from "./productDeliveryCheck.styles";
import { ProductDeliveryEligibilityNotice } from "./ProductDeliveryEligibilityNotice.component";
import { useProductDeliveryCheckPresentation } from "./useProductDeliveryCheckPresentation.hook";

export interface ProductDeliveryCheckProps {
  productId: string;
  variantId?: string | null;
  vendorId?: string | null;
  codAvailable?: boolean;
  codEligibleAtUnitPrice?: boolean;
  codMinOrderValue?: number;
  codMaxOrderValue?: number | null;
  onBlockedChange?: (blocked: boolean) => void;
}

export function ProductDeliveryCheck({
  productId,
  variantId,
  vendorId,
  codAvailable = false,
  codEligibleAtUnitPrice = false,
  codMinOrderValue = 0,
  codMaxOrderValue = null,
  onBlockedChange,
}: ProductDeliveryCheckProps) {
  const {
    pincode,
    pincodeError,
    quoteQuery,
    eligibility,
    handleCheck,
    handleInputChange,
    handleInputKeyDown,
    isCheckDisabled,
  } = useProductDeliveryCheckPresentation({
    productId,
    variantId,
    vendorId,
    codAvailable,
    codEligibleAtUnitPrice,
    onBlockedChange,
  });

  return (
    <div className={productDeliveryCheckStyles.root}>
      <div className={productDeliveryCheckStyles.header}>
        <Truck
          className={productDeliveryCheckStyles.truckIcon}
          strokeWidth={1.75}
        />
        <p className={productDeliveryCheckStyles.title}>
          {LABELS.enterDeliveryPincode}
        </p>
      </div>
      <p className={productDeliveryCheckStyles.hint}>
        {LABELS.deliveryPincodeHint}
      </p>
      <div className={productDeliveryCheckStyles.inputRow}>
        <Input
          inputMode="numeric"
          maxLength={PINCODE_LENGTH}
          value={pincode}
          error={Boolean(pincodeError) || eligibility.notServiceable}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          aria-label={LABELS.enterDeliveryPincode}
          placeholder={LABELS.enterDeliveryPincode}
          autoComplete="postal-code"
          className={productDeliveryCheckStyles.input}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isCheckDisabled}
          onClick={handleCheck}
        >
          {LABELS.checkPincode}
        </Button>
      </div>
      {pincodeError ? (
        <p className={productDeliveryCheckStyles.errorText}>{pincodeError}</p>
      ) : null}
      {quoteQuery.isError ? (
        <p className={productDeliveryCheckStyles.errorText}>
          {getApiErrorMessage(quoteQuery.error, LABELS.deliveryCheckFailed)}
        </p>
      ) : null}
      <ProductDeliveryEligibilityNotice
        eligibility={eligibility}
        codAvailable={codAvailable}
        codEligibleAtUnitPrice={codEligibleAtUnitPrice}
        codMinOrderValue={codMinOrderValue}
        codMaxOrderValue={codMaxOrderValue}
      />
    </div>
  );
}
