"use client";

import { useAdminCouponsPage } from "../hooks/useAdminCouponsPage.hook";
import { CouponsPageHeader } from "../components/CouponsPageHeader.component";
import { CouponsTable } from "../components/CouponsTable.component";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { LABELS } from "@/shared/constants/labels";
import { adminPagesStyles } from "./adminPages.styles";

export function AdminCouponsPage() {
  const page = useAdminCouponsPage();

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
        onValueChange={(value) => page.setTab(value as "platform" | "vendor")}
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
      </Tabs>
    </div>
  );
}
