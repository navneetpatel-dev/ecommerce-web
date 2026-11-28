"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  PROMO_BANNER_LINK_TYPE_VALUES,
  PROMO_BANNER_STATUS_VALUES,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";

interface PromoBannerSelectFieldsProps {
  linkType: PromoBannerLinkType;
  status: PromoBannerStatus;
  onLinkTypeChange: (value: PromoBannerLinkType) => void;
  onLinkTargetIdChange: (value: string) => void;
  onStatusChange: (value: PromoBannerStatus) => void;
}

/** What a banner links to and whether it is shown. A new link type clears the target. */
export function PromoBannerSelectFields({
  linkType,
  status,
  onLinkTypeChange,
  onLinkTargetIdChange,
  onStatusChange,
}: PromoBannerSelectFieldsProps) {
  const handleLinkTypeChange = (value: string) => {
    onLinkTypeChange(value as PromoBannerLinkType);
    onLinkTargetIdChange("");
  };
  const handleStatusChange = (value: string) =>
    onStatusChange(value as PromoBannerStatus);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormFieldFrame
        label={LABELS.promoBannerLinkType}
        htmlFor="banner-link-type"
      >
        <Select value={linkType} onValueChange={handleLinkTypeChange}>
          <SelectTrigger id="banner-link-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROMO_BANNER_LINK_TYPE_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.promoBannerStatus} htmlFor="banner-status">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger id="banner-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROMO_BANNER_STATUS_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </div>
  );
}
