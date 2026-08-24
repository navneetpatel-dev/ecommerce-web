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
import { cn } from "@/shared/utils/cn";

export function AdminCouponsPage() {
  const page = useAdminCouponsPage();

  return (
    <div className="space-y-6">
      <CouponsPageHeader
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
      />

      <Tabs
        value={page.tab}
        onValueChange={(value) => page.setTab(value as "platform" | "vendor")}
        className="min-w-0"
      >
        <TabsList
          className={cn(
            "flex h-auto w-full flex-wrap justify-start gap-1 rounded-md border border-line-strong",
            "bg-paper p-1",
          )}
        >
          <TabsTrigger
            value="platform"
            className={cn(
              "rounded-sm px-4 py-2.5 text-body-sm text-ink-muted hover:text-ink",
              "data-[state=active]:bg-brand data-[state=active]:text-paper data-[state=active]:shadow-none",
            )}
          >
            {LABELS.platformCoupons}
          </TabsTrigger>
          <TabsTrigger
            value="vendor"
            className={cn(
              "rounded-sm px-4 py-2.5 text-body-sm text-ink-muted hover:text-ink",
              "data-[state=active]:bg-brand data-[state=active]:text-paper data-[state=active]:shadow-none",
            )}
          >
            {LABELS.vendorCoupons}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="platform"
          className="mt-6 min-w-0 focus-visible:outline-none"
        >
          <CouponsTable
            coupons={page.coupons}
            loading={page.isLoading}
            pagination={page.pagination}
          />
        </TabsContent>
        <TabsContent
          value="vendor"
          className="mt-6 min-w-0 focus-visible:outline-none"
        >
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
