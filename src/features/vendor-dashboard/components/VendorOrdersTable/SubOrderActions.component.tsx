"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import {
  SUB_ORDER_STATUS_CONFIRMED,
  SUB_ORDER_STATUS_SHIPPED,
  SUB_ORDER_STATUS_DELIVERED,
  SUB_ORDER_STATUS_CANCELLED,
} from "./subOrderStatuses";

interface SubOrderActionsProps {
  subOrderId: string;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string) => void;
}

const DEFAULT_NEXT_STATUS = SUB_ORDER_STATUS_SHIPPED;

/** Inline status editor for a vendor sub-order row. */
export function SubOrderActions(props: SubOrderActionsProps) {
  const { subOrderId, updatingId, onSetUpdatingId, onStatusChange } = props;
  const isEditing = updatingId === subOrderId;

  const handleStatusSelect = (value: string) => {
    onStatusChange(subOrderId, value);
  };

  const startEditing = () => {
    onSetUpdatingId(subOrderId);
  };

  const cancelEditing = () => {
    onSetUpdatingId(null);
  };

  if (!isEditing) {
    return (
      <TableRowActions>
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            className={tableMenuButtonClass("edit")}
            onClick={startEditing}
          >
            {LABELS.updateStatus}
          </Button>
        </TableRowAction>
      </TableRowActions>
    );
  }

  return (
    <TableRowActions>
      <TableRowAction>
        <Select
          defaultValue={DEFAULT_NEXT_STATUS}
          onValueChange={handleStatusSelect}
        >
          <SelectTrigger
            aria-label={LABELS.selectStatus}
            className="w-full min-w-[8.5rem] rounded-sm px-2 text-body-sm"
          >
            <SelectValue placeholder={LABELS.selectStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SUB_ORDER_STATUS_CONFIRMED}>
              {LABELS.confirm}
            </SelectItem>
            <SelectItem value={SUB_ORDER_STATUS_SHIPPED}>
              {LABELS.orderActionShip}
            </SelectItem>
            <SelectItem value={SUB_ORDER_STATUS_DELIVERED}>
              {LABELS.orderActionDeliver}
            </SelectItem>
            <SelectItem value={SUB_ORDER_STATUS_CANCELLED}>
              {LABELS.cancel}
            </SelectItem>
          </SelectContent>
        </Select>
      </TableRowAction>
      <TableRowAction>
        <Button
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={cancelEditing}
        >
          {LABELS.cancel}
        </Button>
      </TableRowAction>
    </TableRowActions>
  );
}
