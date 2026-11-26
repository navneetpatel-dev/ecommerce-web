"use client";

import { CategoryPickerSelect } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { useTaxEffectiveLookup } from "../../hooks/tax/useTaxEffectiveLookup.hook";
import { adminTaxStyles as styles } from "../../styles/tax/adminTax.styles";

/** Pick a category, see the GST it gets and why. */
export function TaxEffectiveLookup() {
  const lookup = useTaxEffectiveLookup();

  return (
    <section className={styles.lookup} aria-labelledby="tax-lookup-title">
      <h2 id="tax-lookup-title" className={styles.lookupTitle}>
        {LABELS.taxLookupTitle}
      </h2>
      <p className={styles.lookupBody}>{LABELS.taxLookupBody}</p>
      <CategoryPickerSelect
        value={lookup.category?.id ?? ""}
        selected={lookup.category}
        onSelect={lookup.selectCategory}
        onClear={lookup.clear}
        noneLabel={LABELS.selectCategory}
      />
      {lookup.error ? (
        <p role="alert" className={styles.lookupBody}>
          {lookup.error}
        </p>
      ) : null}
      {lookup.result ? (
        <p role="status" className={styles.lookupResult}>
          <span className={styles.lookupRate}>
            {lookup.result.gstPercentage}%
          </span>
          <span>{lookup.sourceText}</span>
        </p>
      ) : null}
    </section>
  );
}
