"use client";

import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { PATHS } from "@/shared/constants/paths/paths";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { AdminDataPage } from "../../pages/shared/AdminDataPage.page";
import type { NotificationLogFilters } from "../../api/notifications/notifications.api";
import type { useAdminNotificationsPage } from "../../hooks/notifications/useAdminNotificationsPage.hook";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { NotificationLogFiltersBar } from "./NotificationLogFiltersBar.component";
import { NotificationLogRowActions } from "./NotificationLogRowActions.component";

function emailTemplateHref(type: unknown, channel: unknown): string | null {
  if (channel !== "EMAIL" || typeof type !== "string" || !type.trim()) {
    return null;
  }
  return `${PATHS.admin.emailTemplates}?type=${encodeURIComponent(type)}`;
}

const renderRowActions = (row: AdminDataRow, reload: () => void) => (
  <NotificationLogRowActions
    id={String(row.id)}
    status={String(row.status)}
    createdAt={typeof row.createdAt === "string" ? row.createdAt : undefined}
    reload={reload}
  />
);

interface NotificationLogsTabProps {
  filters: NotificationLogFilters;
  setFilters: Dispatch<SetStateAction<NotificationLogFilters>>;
  loadLogs: ReturnType<typeof useAdminNotificationsPage>["loadLogs"];
}

/** The delivery log: its filters and the table of email and push attempts. */
export function NotificationLogsTab({
  filters,
  setFilters,
  loadLogs,
}: NotificationLogsTabProps) {
  return (
    <>
      <div className="space-y-2">
        {filters.referenceId && (
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-caption text-brand">
            <span className="font-mono">
              Broadcast: {filters.referenceId.slice(0, 8)}…
            </span>
            <IconCloseButton
              variant="inline"
              label="Clear broadcast filter"
              onClick={() =>
                setFilters((prev) => ({ ...prev, referenceId: undefined }))
              }
            />
          </div>
        )}
        <NotificationLogFiltersBar filters={filters} onChange={setFilters} />
      </div>

      <AdminDataPage
        title="Notification logs"
        hideTitle
        permission={PERMISSIONS.SETTINGS_MANAGE}
        load={loadLogs}
        columnKeys={[
          "type",
          "channel",
          "recipient",
          "status",
          "attempts",
          "errorCategory",
          "error",
          "sentAt",
          "createdAt",
        ]}
        cellOverrides={{
          type: (row) => {
            const href = emailTemplateHref(row.type, row.channel);
            const label = String(row.type ?? "—");
            if (!href) return label;
            return (
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-mono text-body-xs text-brand hover:underline"
                title="View email template"
              >
                <span>{label}</span>
                <ArrowUpRight className="size-3 shrink-0" aria-hidden="true" />
              </Link>
            );
          },
        }}
        detailFieldLinks={{
          type: (val, rec) => emailTemplateHref(val, rec.channel),
        }}
        actions={renderRowActions}
        fetchRowDetail={async (row) =>
          row as unknown as Record<string, unknown>
        }
      />
    </>
  );
}
