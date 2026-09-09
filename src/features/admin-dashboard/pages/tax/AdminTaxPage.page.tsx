"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminTaxRuleForm } from "../../components/tax/AdminTaxRuleForm.component";
import { useAdminTaxPage } from "../../hooks/tax/useAdminTaxPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

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
