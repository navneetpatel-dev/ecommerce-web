import Link from "next/link";
import { Eye } from "lucide-react";
import { USER_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import { isSelfAdminTarget } from "../../utils/shared/isSelfAdminTarget";
import { adminUsersApi } from "../../api/users/users.api.hook";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

interface AdminUserRowActionsProps {
  row: AdminDataRow;
  reload: () => void;
  currentUserId?: string;
}

export function AdminUserRowActions({
  row,
  reload,
  currentUserId,
}: AdminUserRowActionsProps) {
  const name = adminRowLabel(row);
  const isBlocked = row.status === USER_STATUS.BLOCKED;
  const isSelf = isSelfAdminTarget(row.id, currentUserId);

  const toggleBlocked = () =>
    adminUsersApi
      .updateStatus(
        String(row.id),
        isBlocked ? USER_STATUS.ACTIVE : USER_STATUS.BLOCKED,
      )
      .then(reload);

  const deleteUser = () => adminUsersApi.delete(String(row.id)).then(reload);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        asChild
      >
        <Link href={`/admin/users/${row.id}`}>
          <Eye strokeWidth={2.25} aria-hidden />
          <span>{LABELS.view}</span>
        </Link>
      </Button>
      {isSelf ? null : (
        <AdminConfirmAction
          label={isBlocked ? LABELS.activate : LABELS.block}
          dialogVariant={isBlocked ? "success" : "warning"}
          tone={isBlocked ? "success" : "neutral"}
          title={
            isBlocked
              ? LABELS.confirmActivateUserTitle
              : LABELS.confirmBlockUserTitle
          }
          description={formatLabel(
            isBlocked
              ? LABELS.confirmActivateUserBody
              : LABELS.confirmBlockUserBody,
            { name },
          )}
          onConfirm={toggleBlocked}
        />
      )}
      {isSelf ? null : (
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteUserTitle}
          description={formatLabel(LABELS.confirmDeleteUserBody, { name })}
          onConfirm={deleteUser}
        />
      )}
    </>
  );
}
