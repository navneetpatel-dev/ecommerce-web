"use client";

import { useState } from "react";
import {
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_STATUS,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { homepageAdminApi } from "../../api/homepage.api";

export interface UsePromoBannerEditParams {
  /** Refreshes the banner list after a successful save. */
  onSaved: () => Promise<void>;
  onMessage: (message: string | null) => void;
}

/** Inline edit-row state for the promo banners table (Rule 3 split). */
export function usePromoBannerEdit(params: UsePromoBannerEditParams) {
  const { onSaved, onMessage } = params;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [editLinkType, setEditLinkType] = useState<PromoBannerLinkType>(
    PROMO_BANNER_LINK_TYPE.URL,
  );
  const [editLinkTargetId, setEditLinkTargetId] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [editStatus, setEditStatus] = useState<PromoBannerStatus>(
    PROMO_BANNER_STATUS.DRAFT,
  );
  const [editPriority, setEditPriority] = useState("0");
  const [saving, setSaving] = useState(false);

  const startEdit = (banner: PromoBanner) => {
    setEditingId(banner.id);
    setEditTitle(banner.title);
    setEditImageUrl(banner.imageUrl);
    setEditLinkType(banner.linkType as PromoBannerLinkType);
    setEditLinkTargetId(banner.linkTargetId ?? "");
    setEditLinkUrl(banner.linkUrl ?? "");
    setEditStatus(banner.status as PromoBannerStatus);
    setEditPriority(String(banner.priority ?? 0));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageUrl(null);
  };

  const onSaveEdit = async () => {
    if (!editingId || !editTitle.trim() || !editImageUrl) return;
    setSaving(true);
    onMessage(null);
    try {
      await homepageAdminApi.updateBanner(editingId, {
        title: editTitle.trim(),
        imageUrl: editImageUrl,
        linkType: editLinkType,
        linkTargetId:
          editLinkType === PROMO_BANNER_LINK_TYPE.URL
            ? null
            : editLinkTargetId.trim(),
        linkUrl:
          editLinkType === PROMO_BANNER_LINK_TYPE.URL
            ? editLinkUrl.trim()
            : null,
        status: editStatus,
        priority: Number(editPriority) || 0,
      });
      onMessage(LABELS.promoBannerSaved);
      cancelEdit();
      await onSaved();
    } catch (err) {
      onMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner));
    } finally {
      setSaving(false);
    }
  };

  return {
    editingId,
    editTitle,
    setEditTitle,
    editImageUrl,
    setEditImageUrl,
    editStatus,
    setEditStatus,
    editPriority,
    setEditPriority,
    saving,
    startEdit,
    cancelEdit,
    onSaveEdit,
  };
}
