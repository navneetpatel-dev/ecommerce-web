"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { VendorCouponsView } from "../../components/coupons/VendorCouponsView.component";
import { useVendorCouponsPage } from "../../hooks/coupons/useVendorCouponsPage.hook";

export function VendorCouponsPage() {
  const page = useVendorCouponsPage();

  return (
    <RequirePermission
      permission={[PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_UPDATE]}
    >
      <VendorCouponsView
        coupons={page.coupons}
        loading={page.isLoading}
        pagination={page.pagination}
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        isPending={page.isPending}
        formLevelError={page.formLevelError}
        onSubmit={page.onSubmit}
        vendorId={page.vendorId}
        analyticsId={page.analyticsId}
        setAnalyticsId={page.setAnalyticsId}
        analytics={page.analytics}
        analyticsLoading={page.analyticsLoading}
        absorbedDiscountTotal={page.absorbedDiscountTotal}
        onUpdateStatus={page.updateStatus}
      />
    </RequirePermission>
  );
}
