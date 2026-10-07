"use client";

import { useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PROMO_BANNER_STATUS } from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/DataTable/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { promoBannersListStyles } from "./adminPromoBanners.styles";

interface PromoBannerRowActionsProps {
  banner: PromoBanner;
  onStartEdit: (banner: PromoBanner) => void;
  onActivate: (banner: PromoBanner) => void;
  onDelete: (banner: PromoBanner) => void;
}

/** Edit / activate / delete actions for one promo banner row. */
export function PromoBannerRowActions({
  banner,
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
      <TableRowAction>
        <Button
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("edit")}
          onClick={handleEdit}
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
            onClick={handleActivate}
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
          onClick={handleDelete}
        >
          {LABELS.delete}
        </Button>
      </TableRowAction>
    </TableRowActions>
  );
}
