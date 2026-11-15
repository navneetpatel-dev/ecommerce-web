"use client";

import {
  useAdminCouponsPage,
  type CouponsTab,
} from "../../hooks/coupons/useAdminCouponsPage.hook";
import { CouponsPageHeader } from "../../components/coupons/CouponsPageHeader.component";
import { CouponsTable } from "../../components/coupons/CouponsTable.component";
import { CouponBatchesTab } from "../../components/coupons/CouponBatchesTab.component";
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

  const handleTabChange = (value: string) => page.setTab(value as CouponsTab);

  return (
    <div className={adminPagesStyles.stack6}>
      <CouponsPageHeader
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
        formLevelError={page.formLevelError}
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
          <TabsTrigger
            value="batches"
            className={adminPagesStyles.tabTriggerBrand}
          >
            {LABELS.couponBatches}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className={adminPagesStyles.tabContent}>
          <CouponsTable
            coupons={page.coupons}
            loading={page.isLoading}
            pagination={page.pagination}
          />
        </TabsContent>
        <TabsContent value="vendor" className={adminPagesStyles.tabContent}>
          <CouponsTable
            coupons={page.coupons}
            loading={page.isLoading}
            pagination={page.pagination}
            readOnly
            allowReject
          />
        </TabsContent>
        <TabsContent value="batches" className={adminPagesStyles.tabContent}>
          <CouponBatchesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
