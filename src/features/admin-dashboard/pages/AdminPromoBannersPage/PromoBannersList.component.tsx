"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PROMO_BANNER_STATUS } from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { PromoBannerEditForm } from "./PromoBannerEditForm.component";
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
              <TableRowActions className={promoBannersListStyles.actions}>
                <TableRowAction>
                  <Button
                    size="sm"
                    variant="outline"
                    className={tableMenuButtonClass("edit")}
                    onClick={() => onStartEdit(banner)}
                  >
                    {LABELS.editPromoBanner}
                  </Button>
                </TableRowAction>
                {banner.status !== PROMO_BANNER_STATUS.ACTIVE ? (
                  <TableRowAction>
                    <Button
                      size="sm"
                      variant="outline"
                      className={tableMenuButtonClass("success")}
                      onClick={() => onActivate(banner)}
                    >
                      {PROMO_BANNER_STATUS.ACTIVE}
                    </Button>
                  </TableRowAction>
                ) : null}
                <TableRowAction destructive>
                  <Button
                    size="sm"
                    variant="outline"
                    className={tableMenuButtonClass("danger")}
                    onClick={() => onDelete(banner)}
                  >
                    {LABELS.delete}
                  </Button>
                </TableRowAction>
              </TableRowActions>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
