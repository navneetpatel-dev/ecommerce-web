"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { GST_SLABS } from "@/shared/constants/tax/gstSlabs";
import { LABELS } from "@/shared/constants/labels";

const ALL = "__ALL__";

interface TaxFilterSelectsProps {
  gstTier: string;
  hasPriceBand: string;
  scope: string;
  onGstTierChange: (value: string) => void;
  onHasPriceBandChange: (value: string) => void;
  onScopeChange: (value: string) => void;
}

/** The slab, price band and scope filters of the tax rules list. */
export function TaxFilterSelects({
  gstTier,
  hasPriceBand,
  scope,
  onGstTierChange,
  onHasPriceBandChange,
  onScopeChange,
}: TaxFilterSelectsProps) {
  const fromAll = (apply: (value: string) => void) => (value: string) =>
    apply(value === ALL ? "" : value);

  return (
    <>
      <FormFieldFrame label="GST Slab" htmlFor="tax-filter-gst">
        <Select value={gstTier || ALL} onValueChange={fromAll(onGstTierChange)}>
          <SelectTrigger id="tax-filter-gst">
            <SelectValue placeholder="All Slabs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Slabs</SelectItem>
            {GST_SLABS.map((slab) => (
              <SelectItem key={slab} value={String(slab)}>
                {slab}% GST
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label="Price Band" htmlFor="tax-filter-band">
        <Select
          value={hasPriceBand || ALL}
          onValueChange={fromAll(onHasPriceBandChange)}
        >
          <SelectTrigger id="tax-filter-band">
            <SelectValue placeholder="All Rules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Rules</SelectItem>
            <SelectItem value="YES">Has Price Band</SelectItem>
            <SelectItem value="NO">Flat Rate Only</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.taxRuleAppliesTo}
        htmlFor="tax-filter-scope"
      >
        <Select value={scope || ALL} onValueChange={fromAll(onScopeChange)}>
          <SelectTrigger id="tax-filter-scope">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{LABELS.taxRuleScopeAll}</SelectItem>
            <SelectItem value="default">
              {LABELS.taxRuleScopeDefault}
            </SelectItem>
            <SelectItem value="category">
              {LABELS.taxRuleScopeCategory}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </>
  );
}
