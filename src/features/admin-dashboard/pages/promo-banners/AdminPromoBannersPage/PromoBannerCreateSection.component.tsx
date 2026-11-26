"use client";

import type { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { FileUpload } from "@/shared/components/FileUpload";
import { FormFieldFrame } from "@/shared/components/forms";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import {
  PROMO_BANNER_LINK_TYPE_VALUES,
  PROMO_BANNER_STATUS_VALUES,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import { PromoBannerTargetField } from "./PromoBannerTargetField.component";

export interface PromoBannerCreateDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onToggle?: () => void;
  draftId: string;
  title: string;
  onTitleChange: (value: string) => void;
  imageUrl: string | null;
  onImageUploaded: (url: string | null) => void;
  linkType: PromoBannerLinkType;
  onLinkTypeChange: (value: PromoBannerLinkType) => void;
  status: PromoBannerStatus;
  onStatusChange: (value: PromoBannerStatus) => void;
  linkUrl: string;
  onLinkUrlChange: (value: string) => void;
  linkTargetId: string;
  onLinkTargetIdChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  saving: boolean;
  message: string | null;
  canSubmit: boolean;
  disableHint: string;
  onCreate: () => void;
}

export function PromoBannerCreateDialog({
  open,
  isOpen,
  onOpenChange,
  onToggle,
  draftId,
  title,
  onTitleChange,
  imageUrl,
  onImageUploaded,
  linkType,
  onLinkTypeChange,
  status,
  onStatusChange,
  linkUrl,
  onLinkUrlChange,
  linkTargetId,
  onLinkTargetIdChange,
  priority,
  onPriorityChange,
  saving,
  message,
  canSubmit,
  disableHint,
  onCreate,
}: PromoBannerCreateDialogProps) {
  const isDialogOpen = open ?? isOpen ?? false;
  const handleOpenChange = (val: boolean) => {
    onOpenChange?.(val);
    if (!val && onToggle) onToggle();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onTitleChange(event.target.value);
  const handleLinkTypeChange = (value: string) => {
    onLinkTypeChange(value as PromoBannerLinkType);
    onLinkTargetIdChange("");
  };
  const handleStatusChange = (value: string) =>
    onStatusChange(value as PromoBannerStatus);
  const handlePriorityChange = (value: number | undefined) =>
    onPriorityChange(value == null ? "" : String(value));

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="size-5 text-brand" aria-hidden />
            <span>{LABELS.promoBannerFormSection}</span>
          </DialogTitle>
          <DialogDescription>
            {LABELS.promoBannerFormSectionHint}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <FormFieldFrame
            label={LABELS.promoBannerTitle}
            htmlFor="banner-title"
          >
            <Input
              id="banner-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Summer Flash Sale, 50% Off Electronics"
            />
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.promoBannerImage}>
            <FileUpload
              entityType={UPLOAD_ENTITY.BANNERS}
              entityId={draftId}
              purpose={UPLOAD_PURPOSE.IMAGE}
              accept="image/png,image/jpeg,image/webp"
              valueUrl={imageUrl}
              onUploaded={onImageUploaded}
              disabled={saving}
              label={LABELS.promoBannerImage}
            />
          </FormFieldFrame>

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

            <FormFieldFrame
              label={LABELS.promoBannerStatus}
              htmlFor="banner-status"
            >
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PromoBannerTargetField
              linkType={linkType}
              linkUrl={linkUrl}
              onLinkUrlChange={onLinkUrlChange}
              linkTargetId={linkTargetId}
              onLinkTargetIdChange={onLinkTargetIdChange}
            />

            <FormFieldFrame
              label={LABELS.promoBannerPriority}
              htmlFor="banner-priority"
            >
              <NumberInput
                id="banner-priority"
                value={priority === "" ? undefined : Number(priority)}
                step={1}
                onChange={handlePriorityChange}
              />
            </FormFieldFrame>
          </div>

          {message ? (
            <p className="text-body-sm font-medium text-ink">{message}</p>
          ) : disableHint && !canSubmit ? (
            <p className="text-body-sm text-ink-muted">{disableHint}</p>
          ) : null}
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 pt-4 border-t border-line/80">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => handleOpenChange(false)}
          >
            {LABELS.cancel}
          </Button>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="button"
              disabled={saving || !canSubmit}
              onClick={onCreate}
            >
              {saving ? LABELS.loading : LABELS.createPromoBanner}
            </Button>
          </DisabledActionHint>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export alias for backwards compatibility
export const PromoBannerCreateSection = PromoBannerCreateDialog;
export type PromoBannerCreateSectionProps = PromoBannerCreateDialogProps;
