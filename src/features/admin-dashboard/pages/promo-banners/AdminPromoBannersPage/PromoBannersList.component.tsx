"use client";

import { LABELS } from "@/shared/constants/labels";
import type { PromoBanner } from "@/shared/api/types";
import { PromoBannerEditForm } from "./PromoBannerEditForm.component";
import { PromoBannerRowActions } from "./PromoBannerRowActions.component";
import { promoBannersListStyles } from "./adminPromoBanners.styles";

interface PromoBannersListProps {
  banners: PromoBanner[];
  saving: boolean;
  editingId: string | null;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  editImageUrl: string | null;
  onEditImageUploaded: (url: string | null) => void;
  editStatus: PromoBanner["status"];
  onEditStatusChange: (value: PromoBanner["status"]) => void;
  editPriority: string;
  onEditPriorityChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStartEdit: (banner: PromoBanner) => void;
  onActivate: (banner: PromoBanner) => void;
  onDelete: (banner: PromoBanner) => void;
}

export function PromoBannersList({
  banners,
  saving,
  editingId,
  editTitle,
  onEditTitleChange,
  editImageUrl,
  onEditImageUploaded,
  editStatus,
  onEditStatusChange,
  editPriority,
  onEditPriorityChange,
  onCancelEdit,
  onSaveEdit,
  onStartEdit,
  onActivate,
  onDelete,
}: PromoBannersListProps) {
  return (
    <ul className={promoBannersListStyles.list}>
      {banners.map((banner) => (
        <li key={banner.id} className={promoBannersListStyles.item}>
          {editingId === banner.id ? (
            <PromoBannerEditForm
              bannerId={banner.id}
              editTitle={editTitle}
              onEditTitleChange={onEditTitleChange}
              editImageUrl={editImageUrl}
              onEditImageUploaded={onEditImageUploaded}
              editStatus={editStatus}
              onEditStatusChange={onEditStatusChange}
              editPriority={editPriority}
              onEditPriorityChange={onEditPriorityChange}
              saving={saving}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
            />
          ) : (
            <>
              <div className={promoBannersListStyles.itemInfo}>
                <p className={promoBannersListStyles.itemTitle}>
                  {banner.title}
                </p>
                <p className={promoBannersListStyles.itemSubtitle}>
                  {banner.status} · {banner.linkType} ·{" "}
                  {LABELS.promoBannerPriority} {banner.priority}
                </p>
              </div>
              <PromoBannerRowActions
                banner={banner}
                onStartEdit={onStartEdit}
                onActivate={onActivate}
                onDelete={onDelete}
              />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
