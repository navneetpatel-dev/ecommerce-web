"use client";

import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_STATUS,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { formatLabel } from "@/shared/utils/formatLabel";
import { homepageAdminApi } from "../../api/homepage.api";
import { usePromoBannerCreateForm } from "./usePromoBannerCreateForm";

export function usePromoBanners() {
  const createForm = usePromoBannerCreateForm();

  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBanners(await homepageAdminApi.listBanners());
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadPromoBanners));
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async () => {
    if (!createForm.canSubmit || !createForm.imageUrl) return;
    setSaving(true);
    setMessage(null);
    try {
      await homepageAdminApi.createBanner({
        title: createForm.title.trim(),
        imageUrl: createForm.imageUrl,
        linkType: createForm.linkType,
        linkTargetId:
          createForm.linkType === PROMO_BANNER_LINK_TYPE.URL
            ? null
            : createForm.linkTargetId.trim(),
        linkUrl:
          createForm.linkType === PROMO_BANNER_LINK_TYPE.URL
            ? createForm.linkUrl.trim()
            : null,
        status: createForm.status,
        priority: Number(createForm.priority) || 0,
      });
      setMessage(LABELS.promoBannerSaved);
      createForm.resetForm();
      await load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (banner: PromoBanner) => {
    if (
      !window.confirm(
        formatLabel(LABELS.confirmDeletePromoBannerBody, {
          name: banner.title,
        }),
      )
    ) {
      return;
    }
    setMessage(null);
    try {
      await homepageAdminApi.deleteBanner(banner.id);
      setMessage(LABELS.promoBannerDeleted);
      await load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner));
    }
  };

  const onActivate = async (banner: PromoBanner) => {
    setMessage(null);
    try {
      await homepageAdminApi.updateBanner(banner.id, {
        status: PROMO_BANNER_STATUS.ACTIVE,
      });
      setMessage(LABELS.promoBannerSaved);
      await load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner));
    }
  };

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
    setMessage(null);
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
      setMessage(LABELS.promoBannerSaved);
      cancelEdit();
      await load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner));
    } finally {
      setSaving(false);
    }
  };

  return {
    ...createForm,
    banners,
    loading,
    error,
    message,
    saving,
    editingId,
    editTitle,
    setEditTitle,
    editImageUrl,
    setEditImageUrl,
    editStatus,
    setEditStatus,
    editPriority,
    setEditPriority,
    onCreate,
    onDelete,
    onActivate,
    startEdit,
    cancelEdit,
    onSaveEdit,
  };
}
