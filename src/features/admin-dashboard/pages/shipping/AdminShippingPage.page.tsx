"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminShippingZoneForm } from "../../components/shipping/AdminShippingZoneForm.component";
import { AdminShippingRateForm } from "../../components/shipping/AdminShippingRateForm.component";
import { useAdminShippingPage } from "../../hooks/shipping/useAdminShippingPage";
import { useAdminShippingRatesPage } from "../../hooks/shipping/useAdminShippingRatesPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminShippingPage() {
  const page = useAdminShippingPage();
  const ratesPage = useAdminShippingRatesPage();

  return (
    <div className={adminPagesStyles.stack5}>
      <AdminShippingZoneForm {...page.form} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
      />
      <AdminShippingRateForm {...ratesPage.form} />
      <AdminDataPage
        title={ratesPage.title}
        permission={ratesPage.permission}
        load={ratesPage.load}
        actions={ratesPage.actions}
        columnKeys={ratesPage.columnKeys}
      />
    </div>
  );
}
