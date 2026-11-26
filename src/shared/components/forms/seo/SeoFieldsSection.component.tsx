"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { SEO_LIMITS } from "@/shared/constants/seo/seoLimits";
import { seoFieldsStyles as styles } from "@/shared/styles/forms/seoFields.styles";
import { FormFieldFrame } from "../FormFieldFrame.component";
import { FormSection } from "../FormSection.component";
import { SeoSearchPreview } from "./SeoSearchPreview.component";

export interface SeoFieldState {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

interface SeoFieldsSectionProps {
  seoTitle: SeoFieldState;
  seoDescription: SeoFieldState;
  fallbackTitle: string;
  fallbackDescription: string;
  disabled?: boolean;
  /** Ids for the two controls (labels point at them). */
  idPrefix?: string;
}

/**
 * The "Search listing" section every form with SEO fields uses (products, categories): full-width
 * title and description with hints and counters, then a live search-result preview.
 */
export function SeoFieldsSection({
  seoTitle,
  seoDescription,
  fallbackTitle,
  fallbackDescription,
  disabled = false,
  idPrefix = "seo",
}: SeoFieldsSectionProps) {
  const handleTitle = (event: ChangeEvent<HTMLInputElement>) =>
    seoTitle.onChange(event.target.value);
  const handleDescription = (event: ChangeEvent<HTMLTextAreaElement>) =>
    seoDescription.onChange(event.target.value);

  return (
    <FormSection
      title={LABELS.seoSectionTitle}
      hint={LABELS.seoSectionHint}
      columns={1}
      contentClassName={styles.sectionContent}
    >
      <FormFieldFrame
        label={LABELS.seoTitleLabel}
        htmlFor={`${idPrefix}-title`}
        hint={LABELS.seoTitleHint}
        error={seoTitle.error}
        counter={{ value: seoTitle.value, max: SEO_LIMITS.TITLE_MAX }}
      >
        <Input
          id={`${idPrefix}-title`}
          value={seoTitle.value}
          placeholder={fallbackTitle}
          maxLength={SEO_LIMITS.TITLE_MAX}
          error={Boolean(seoTitle.error)}
          disabled={disabled}
          onChange={handleTitle}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.seoDescriptionLabel}
        htmlFor={`${idPrefix}-description`}
        hint={LABELS.seoDescriptionHint}
        error={seoDescription.error}
        counter={{
          value: seoDescription.value,
          max: SEO_LIMITS.DESCRIPTION_MAX,
        }}
      >
        <Textarea
          id={`${idPrefix}-description`}
          value={seoDescription.value}
          placeholder={LABELS.seoDescriptionPlaceholder}
          maxLength={SEO_LIMITS.DESCRIPTION_MAX}
          error={Boolean(seoDescription.error)}
          disabled={disabled}
          className={styles.descriptionTextarea}
          onChange={handleDescription}
        />
      </FormFieldFrame>
      <SeoSearchPreview
        seoTitle={seoTitle.value}
        seoDescription={seoDescription.value}
        fallbackTitle={fallbackTitle}
        fallbackDescription={fallbackDescription}
      />
    </FormSection>
  );
}
