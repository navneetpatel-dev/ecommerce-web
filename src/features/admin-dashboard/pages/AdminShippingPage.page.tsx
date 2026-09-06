"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { AdminShippingZoneForm } from "../components/AdminShippingZoneForm.component";
import { AdminShippingRateForm } from "../components/AdminShippingRateForm.component";
import { useAdminShippingPage } from "../hooks/useAdminShippingPage";
import { useAdminShippingRatesPage } from "../hooks/useAdminShippingRatesPage";

export function AdminShippingPage() {
  const page = useAdminShippingPage();
  const ratesPage = useAdminShippingRatesPage();

  return (
    <div className="space-y-5">
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
        columnKeys={ratesPage.columnKeys}
      />
    </div>
  );
}
