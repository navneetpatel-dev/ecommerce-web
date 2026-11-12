import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ADDRESS_STEP_STYLES } from "../../styles/address/addressStep.styles";

interface AddressSearchFieldProps {
  value: string;
  resultCount: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** Finds one address among many saved ones at checkout (C-15). */
export function AddressSearchField({
  value,
  resultCount,
  onChange,
}: AddressSearchFieldProps) {
  return (
    <div className={ADDRESS_STEP_STYLES.searchRow}>
      <label
        htmlFor="checkout-address-search"
        className={ADDRESS_STEP_STYLES.srOnly}
      >
        {LABELS.searchAddresses}
      </label>
      <Input
        id="checkout-address-search"
        type="search"
        value={value}
        placeholder={LABELS.searchAddressesPlaceholder}
        onChange={onChange}
        className={ADDRESS_STEP_STYLES.searchInput}
      />
      <p role="status" className={ADDRESS_STEP_STYLES.srOnly}>
        {value.trim()
          ? formatLabel(LABELS.addressMatches, { count: resultCount })
          : ""}
      </p>
    </div>
  );
}
