"use client";

import { useAdminCouponsPage } from "../../hooks/coupons/useAdminCouponsPage.hook";
import { CouponsPageHeader } from "../../components/coupons/CouponsPageHeader.component";
import { CouponsTable } from "../../components/coupons/CouponsTable.component";
import { CouponTableFilters } from "../../components/coupons/CouponDialogs/CouponTableFilters.component";
import { CouponBatchFilterChip } from "../../components/coupons/CouponDialogs/CouponBatchFilterChip.component";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { LABELS } from "@/shared/constants/labels";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminCouponsPage() {
  const page = useAdminCouponsPage();

  const handleTabChange = (value: string) =>
    page.setTab(value as "platform" | "vendor");

  const toolbar = (
    <>
      <CouponTableFilters filters={page.filters} />
      {page.batchFilter ? (
        <CouponBatchFilterChip
          batchName={page.batchFilter.name}
          onClear={page.clearBatchFilter}
        />
      ) : null}
    </>
  );

  return (
    <div className={adminPagesStyles.stack6}>
      <CouponsPageHeader
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
        formLevelError={page.formLevelError}
        onShowBatch={page.showBatch}
      />

      <Tabs
        value={page.tab}
        onValueChange={handleTabChange}
        className={adminPagesStyles.minW0}
      >
        <TabsList className={adminPagesStyles.tabsListStrong}>
          <TabsTrigger
            value="platform"
            className={adminPagesStyles.tabTriggerBrand}
          >
            {LABELS.platformCoupons}
          </TabsTrigger>
          <TabsTrigger
            value="vendor"
            className={adminPagesStyles.tabTriggerBrand}
          >
            {LABELS.vendorCoupons}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className={adminPagesStyles.tabContent}>
          <CouponsTable
            coupons={page.coupons}
            loading={page.isLoading}
            pagination={page.pagination}
            toolbar={toolbar}
          />
        </TabsContent>
        <TabsContent value="vendor" className={adminPagesStyles.tabContent}>
          <CouponsTable
            coupons={page.coupons}
            loading={page.isLoading}
            pagination={page.pagination}
            readOnly
            allowReject
            toolbar={toolbar}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
