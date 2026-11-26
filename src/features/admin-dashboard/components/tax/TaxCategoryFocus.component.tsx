"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { EffectiveTaxRule, TaxRuleRow } from "../../api/tax/tax.api";
import { adminTaxStyles as styles } from "../../styles/tax/adminTax.styles";

interface TaxCategoryFocusProps {
  status: "idle" | "loading" | "notFound" | "ready";
  effective: EffectiveTaxRule | null;
  ownRule: TaxRuleRow | null;
  sourceText: string;
  onEditRule: () => void;
  onSetOwnRate: () => void;
  onClear: () => void;
}

/** Banner shown when the Tax page is opened for one category (from the category dialog). */
export function TaxCategoryFocus({
  status,
  effective,
  ownRule,
  sourceText,
  onEditRule,
  onSetOwnRate,
  onClear,
}: TaxCategoryFocusProps) {
  if (status === "idle" || status === "loading") return null;

  if (status === "notFound" || !effective) {
    return (
      <div role="alert" className={styles.focus}>
        <p className={styles.focusText}>{LABELS.taxFocusNotFound}</p>
        <IconCloseButton variant="dialog" onClick={onClear} />
      </div>
    );
  }

  return (
    <section className={styles.focus} aria-label={LABELS.taxFocusTitle}>
      <div className={styles.focusBody}>
        <p className={styles.focusTitle}>
          {formatLabel(LABELS.taxFocusHeading, {
            name: effective.categoryName,
          })}
        </p>
        <p className={styles.focusText}>
          <span className={styles.lookupRate}>{effective.gstPercentage}%</span>{" "}
          {sourceText}
        </p>
      </div>
      <div className={styles.focusActions}>
        {ownRule ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEditRule}
          >
            <Pencil aria-hidden />
            {LABELS.taxFocusEditRule}
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={onSetOwnRate}>
            <Plus aria-hidden />
            {LABELS.taxFocusSetOwn}
          </Button>
        )}
        <IconCloseButton variant="dialog" onClick={onClear} />
      </div>
    </section>
  );
}
