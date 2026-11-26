"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryGstInfo } from "@/shared/api/types";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useCategoryTaxSection } from "../../hooks/categories/useCategoryTaxSection.hook";
import { adminCategoryStyles as styles } from "../../styles/categories/adminCategory.styles";

interface CategoryTaxSectionProps {
  categoryId: string;
  gst?: CategoryGstInfo;
}

/** The GST this category gets and why; people with tax access get a button to manage it on the Tax page. */
export function CategoryTaxSection({
  categoryId,
  gst,
}: CategoryTaxSectionProps) {
  const { sourceText, canManageTax, taxPath } = useCategoryTaxSection(
    categoryId,
    gst,
  );
  if (!gst) return null;

  return (
    <FormSection
      title={LABELS.categoryTaxSection}
      hint={LABELS.categoryTaxSectionHint}
      columns={1}
    >
      <div className={styles.taxCard}>
        <div className={styles.taxFigureGroup}>
          <span className={styles.taxFigure}>{gst.percent}%</span>
          <span className={styles.taxSource}>{sourceText}</span>
        </div>
        {canManageTax ? (
          <Button asChild variant="outline" size="sm">
            <Link href={taxPath}>
              {LABELS.categoryManageTax}
              <ArrowUpRight aria-hidden />
            </Link>
          </Button>
        ) : null}
      </div>
      {canManageTax ? null : (
        <p className={styles.taxHint}>{LABELS.categoryTaxManageHint}</p>
      )}
    </FormSection>
  );
}
