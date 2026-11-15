"use client";

import { LABELS } from "@/shared/constants/labels";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { AdminShippingZoneForm } from "../../components/shipping/AdminShippingZoneForm.component";
import { AdminShippingRateForm } from "../../components/shipping/AdminShippingRateForm.component";
import { RtoQueuePanel } from "../../components/shipping/RtoQueuePanel.component";
import { useAdminShippingPage } from "../../hooks/shipping/useAdminShippingPage";
import { useAdminShippingRatesPage } from "../../hooks/shipping/useAdminShippingRatesPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminShippingPage() {
  const page = useAdminShippingPage();
  const ratesPage = useAdminShippingRatesPage();

  return (
    <AdminSectionTabs
      title={LABELS.shipping}
      defaultValue="zones"
      tabs={[
        {
          value: "zones",
          label: LABELS.shippingZonesTab,
          content: (
            <div className={adminPagesStyles.stack5}>
              <AdminShippingZoneForm {...page.form} />
              <AdminDataPage
                title={page.title}
                titleLevel={2}
                permission={page.permission}
                load={page.load}
                actions={page.actions}
                columnKeys={page.columnKeys}
              />
            </div>
          ),
        },
        {
          value: "rates",
          label: LABELS.shippingRatesTab,
          content: (
            <div className={adminPagesStyles.stack5}>
              <AdminShippingRateForm {...ratesPage.form} />
              <AdminDataPage
                title={ratesPage.title}
                titleLevel={2}
                permission={ratesPage.permission}
                load={ratesPage.load}
                actions={ratesPage.actions}
                columnKeys={ratesPage.columnKeys}
              />
            </div>
          ),
        },
        {
          value: "rto",
          label: LABELS.shippingRtoTab,
          content: <RtoQueuePanel />,
        },
      ]}
    />
  );
}
