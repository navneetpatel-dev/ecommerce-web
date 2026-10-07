"use client";

import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_STATUS,
} from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { homepageAdminApi } from "../../../api/promo-banners/homepage.api";
import { usePromoBannerCreateForm } from "./usePromoBannerCreateForm.hook";
import { usePromoBannerEdit } from "./usePromoBannerEdit.hook";

/** List + create/delete/activate flows; inline editing has its own hook. */
export function usePromoBanners() {
  const createForm = usePromoBannerCreateForm();

  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [createSaving, setCreateSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PromoBanner | null>(null);

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
    setCreateSaving(true);
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
      setCreateSaving(false);
    }
  };

  const requestDelete = (banner: PromoBanner) => {
    setDeleteTarget(banner);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) cancelDelete();
  };

  const runDelete = async (banner: PromoBanner) => {
    setMessage(null);
    try {
      await homepageAdminApi.deleteBanner(banner.id);
      setMessage(LABELS.promoBannerDeleted);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner));
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    void runDelete(deleteTarget);
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

  const edit = usePromoBannerEdit({ onSaved: load, onMessage: setMessage });

  return {
    ...createForm,
    banners,
    loading,
    error,
    message,
    saving: createSaving || edit.saving,
    editingId: edit.editingId,
    editTitle: edit.editTitle,
    setEditTitle: edit.setEditTitle,
    editImageUrl: edit.editImageUrl,
    setEditImageUrl: edit.setEditImageUrl,
    editStatus: edit.editStatus,
    setEditStatus: edit.setEditStatus,
    editPriority: edit.editPriority,
    setEditPriority: edit.setEditPriority,
    onCreate,
    deleteTarget,
    requestDelete,
    cancelDelete,
    handleDeleteOpenChange,
    confirmDelete,
    onActivate,
    startEdit: edit.startEdit,
    cancelEdit: edit.cancelEdit,
    onSaveEdit: edit.onSaveEdit,
  };
}
