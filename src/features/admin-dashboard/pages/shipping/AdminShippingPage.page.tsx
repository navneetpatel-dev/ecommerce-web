"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { AdminShippingZoneDialog } from "../../components/shipping/AdminShippingZoneDialog.component";
import { AdminShippingRateDialog } from "../../components/shipping/AdminShippingRateDialog.component";
import { AdminShippingZonesFilters } from "../../components/shipping/AdminShippingZonesFilters.component";
import { AdminShippingRatesFilters } from "../../components/shipping/AdminShippingRatesFilters.component";
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
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h2 className="text-body font-semibold tracking-tight text-ink">
                    {LABELS.shippingZonesTab}
                  </h2>
                  <p className="text-body-sm text-ink-muted">
                    Configure geographic delivery zones by state coverage or
                    pincode prefix.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => page.setIsCreateOpen(true)}
                  className="gap-2"
                >
                  <Plus className="size-4" aria-hidden />
                  <span>{LABELS.addShippingZone}</span>
                </Button>
              </div>

              <AdminShippingZoneDialog
                open={page.isCreateOpen}
                onOpenChange={page.setIsCreateOpen}
                {...page.form}
              />

              <AdminShippingZonesFilters
                search={page.search}
                onSearchChange={page.setSearch}
                onClear={page.onClearFilters}
              />

              <AdminDataPage
                title={page.title}
                titleLevel={2}
                hideTitle
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
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h2 className="text-body font-semibold tracking-tight text-ink">
                    {shippingRatesLabels.shippingRates}
                  </h2>
                  <p className="text-body-sm text-ink-muted">
                    Configure rate rules, weight thresholds, transit speeds, and
                    delivery fees.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => ratesPage.setIsCreateOpen(true)}
                  className="gap-2"
                >
                  <Plus className="size-4" aria-hidden />
                  <span>{shippingRatesLabels.addShippingRate}</span>
                </Button>
              </div>

              <AdminShippingRateDialog
                open={ratesPage.isCreateOpen}
                onOpenChange={ratesPage.setIsCreateOpen}
                {...ratesPage.form}
              />

              <AdminShippingRatesFilters
                search={ratesPage.search}
                onSearchChange={ratesPage.setSearch}
                zoneId={ratesPage.zoneFilter}
                onZoneIdChange={ratesPage.setZoneFilter}
                method={ratesPage.methodFilter}
                onMethodChange={ratesPage.setMethodFilter}
                vendorId={ratesPage.vendorFilter}
                onVendorIdChange={ratesPage.setVendorFilter}
                zones={ratesPage.zones}
                vendors={ratesPage.vendors}
                onClear={ratesPage.onClearFilters}
              />

              <AdminDataPage
                title={ratesPage.title}
                titleLevel={2}
                hideTitle
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
