"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  PROMO_BANNER_LINK_TYPE,
  type PromoBannerLinkType,
} from "@/shared/constants/statuses";
import { useCategories } from "@/features/categories";
import { useAdminVendorsList } from "../../../api/analytics/admin.queries";
import { promoBannerSectionStyles } from "./adminPromoBanners.styles";

interface PromoBannerTargetFieldProps {
  linkType: PromoBannerLinkType;
  linkUrl: string;
  onLinkUrlChange: (value: string) => void;
  linkTargetId: string;
  onLinkTargetIdChange: (value: string) => void;
}

export function PromoBannerTargetField({
  linkType,
  linkUrl,
  onLinkUrlChange,
  linkTargetId,
  onLinkTargetIdChange,
}: PromoBannerTargetFieldProps) {
  const { data: categories = [] } = useCategories();
  const { data: vendorsData } = useAdminVendorsList();
  const vendors = vendorsData?.items ?? [];

  const handleLinkUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    onLinkUrlChange(event.target.value);
  const handleLinkTargetIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    onLinkTargetIdChange(event.target.value);

  if (linkType === PROMO_BANNER_LINK_TYPE.URL) {
    return (
      <FormFieldFrame
        label={LABELS.promoBannerLinkUrl}
        htmlFor="banner-link-url"
        className={promoBannerSectionStyles.colSpan2}
      >
        <Input
          id="banner-link-url"
          value={linkUrl}
          onChange={handleLinkUrlChange}
        />
      </FormFieldFrame>
    );
  }

  if (linkType === PROMO_BANNER_LINK_TYPE.CATEGORY) {
    return (
      <FormFieldFrame
        label={LABELS.category}
        htmlFor="banner-category"
        className={promoBannerSectionStyles.colSpan2}
      >
        <Select value={linkTargetId} onValueChange={onLinkTargetIdChange}>
          <SelectTrigger id="banner-category">
            <SelectValue placeholder={LABELS.selectCategory} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
    );
  }

  if (linkType === PROMO_BANNER_LINK_TYPE.VENDOR) {
    return (
      <FormFieldFrame
        label={LABELS.vendorName}
        htmlFor="banner-vendor"
        className={promoBannerSectionStyles.colSpan2}
      >
        <Select value={linkTargetId} onValueChange={onLinkTargetIdChange}>
          <SelectTrigger id="banner-vendor">
            <SelectValue placeholder={LABELS.selectVendor} />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.businessName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
    );
  }

  return (
    <FormFieldFrame
      label={LABELS.promoBannerLinkTargetId}
      htmlFor="banner-link-target-id"
      className={promoBannerSectionStyles.colSpan2}
    >
      <Input
        id="banner-link-target-id"
        value={linkTargetId}
        onChange={handleLinkTargetIdChange}
      />
    </FormFieldFrame>
  );
}
