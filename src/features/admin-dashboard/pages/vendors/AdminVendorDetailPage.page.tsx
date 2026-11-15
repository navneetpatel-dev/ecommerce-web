"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { DetailQuerySkeleton } from "@/shared/components/Skeletons/DetailQuerySkeleton.component";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { useAdminVendorDetail } from "../../hooks/vendors/useAdminVendorDetail.hook";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { AdminVendorDetailActions } from "../../components/vendors/AdminVendorDetailActions.component";
import { VendorDetailEditForm } from "../../components/vendors/VendorDetailEditForm.component";

export function AdminVendorDetailPage() {
  return (
    <RequirePermission
      permission={[PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE]}
    >
      <AdminVendorDetailContent />
    </RequirePermission>
  );
}

function AdminVendorDetailContent() {
  const params = useParams<{ id: string }>();
  const vendorId = params.id;
  const {
    vendor,
    isLoading,
    isError,
    loadError,
    form,
    patchForm,
    save,
    saving,
    message,
    error,
    refetch,
  } = useAdminVendorDetail(vendorId);

  if (isLoading)
    return <DetailQuerySkeleton className={adminPagesStyles.skeletonPy4} />;

  if (isError || !vendor || !form) {
    return (
      <div className={adminPagesStyles.borderBoxEmpty}>
        <QueryErrorAlert
          error={loadError}
          fallback={adminEntityDetailLabels.vendorCouldNotLoadDetail}
          onRetry={refetch}
        />
      </div>
    );
  }

  const statusBadgeElement = vendor.status ? (
    <StatusBadge status={vendor.status} />
  ) : null;
  const formLeadingMessage = message ?? error;

  const handleSave = () => {
    void save();
  };

  return (
    <div className={adminPagesStyles.pageRoot}>
      <Link href="/admin/vendors" className={adminPagesStyles.backLink}>
        <ArrowLeft size={14} aria-hidden />
        {adminEntityDetailLabels.backToVendors}
      </Link>

      <div className={adminPagesStyles.borderBottomRow}>
        <div className={adminPagesStyles.headerInfo}>
          <h1 className={adminPagesStyles.pageHeadingXl}>
            {vendor.businessName}
          </h1>
          <p className={adminPagesStyles.hint}>{vendor.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {statusBadgeElement}
          <AdminVendorDetailActions
            vendorId={vendor.id}
            vendorName={vendor.businessName}
            status={vendor.status ?? ""}
            onRefresh={refetch}
          />
        </div>
      </div>

      <VendorDetailEditForm
        form={form}
        patchForm={patchForm}
        saving={saving}
        formLeadingMessage={formLeadingMessage}
        onSave={handleSave}
      />
    </div>
  );
}
