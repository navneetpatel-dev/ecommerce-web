"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { AdminTaxRuleForm } from "../components/AdminTaxRuleForm.component";
import { useAdminTaxPage } from "../hooks/useAdminTaxPage";
import { adminPagesStyles } from "./adminPages.styles";

export function AdminTaxPage() {
  const page = useAdminTaxPage();

  return (
    <div className={adminPagesStyles.stack5}>
      <AdminTaxRuleForm {...page.form} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
      />
    </div>
  );
}
