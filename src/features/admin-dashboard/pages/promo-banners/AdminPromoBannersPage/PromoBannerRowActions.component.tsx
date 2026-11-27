"use client";

import { useCallback } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PROMO_BANNER_STATUS } from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { promoBannersListStyles } from "./adminPromoBanners.styles";

interface PromoBannerRowActionsProps {
  banner: PromoBanner;
  /** This banner is being activated right now. */
  activating: boolean;
  onStartEdit: (banner: PromoBanner) => void;
  onActivate: (banner: PromoBanner) => void;
  onDelete: (banner: PromoBanner) => void;
}

/** Edit / activate / delete actions for one promo banner row. */
export function PromoBannerRowActions({
  banner,
  activating,
  onStartEdit,
  onActivate,
  onDelete,
}: PromoBannerRowActionsProps) {
  const handleEdit = useCallback(() => {
    onStartEdit(banner);
  }, [onStartEdit, banner]);

  const handleActivate = useCallback(() => {
    onActivate(banner);
  }, [onActivate, banner]);

  const handleDelete = useCallback(() => {
    onDelete(banner);
  }, [onDelete, banner]);

  return (
    <TableRowActions className={promoBannersListStyles.actions}>
      <RowActionButton
        kind="edit"
        icon={Pencil}
        label={LABELS.editPromoBanner}
        onClick={handleEdit}
      />
      {banner.status !== PROMO_BANNER_STATUS.ACTIVE ? (
        <RowActionButton
          icon={Check}
          label={LABELS.activate}
          loading={activating}
          onClick={handleActivate}
        />
      ) : null}
      <RowActionButton
        kind="danger"
        icon={Trash2}
        label={LABELS.delete}
        onClick={handleDelete}
      />
    </TableRowActions>
  );
}
