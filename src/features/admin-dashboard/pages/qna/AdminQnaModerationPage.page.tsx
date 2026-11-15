"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { useAdminQnaModerationPage } from "../../hooks/qna/useAdminQnaModerationPage";

/** New and edited questions and answers awaiting a moderator's decision. */
export function AdminQnaModerationPage() {
  const page = useAdminQnaModerationPage();

  return (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      actions={page.actions}
      columnKeys={page.columnKeys}
    />
  );
}
