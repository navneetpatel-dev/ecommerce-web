"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { Button } from "@/shared/components/ui/button";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import {
  useAdminUser,
  useAdminUserAddresses,
  useAdminUserOrders,
} from "../api/users.queries";
import { ImpersonateUserButton } from "../components/ImpersonateUserButton.component";
import { ChangeUserRoleDialog } from "../components/ChangeUserRoleDialog.component";
import { UserAddressesCard } from "./UserAddressesCard.component";
import { UserRecentOrdersCard } from "./UserRecentOrdersCard.component";
import { adminUserDetailStyles } from "./adminUserDetail.styles";

export function AdminUserDetailPage() {
  return (
    <RequirePermission permission={PERMISSIONS.USER_MANAGE}>
      <AdminUserDetailContent />
    </RequirePermission>
  );
}

function AdminUserDetailContent() {
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const userQuery = useAdminUser(userId);
  const addressesQuery = useAdminUserAddresses(userId);
  const ordersQuery = useAdminUserOrders(userId);

  if (userQuery.isPending) {
    return <DetailQuerySkeleton className={adminUserDetailStyles.skeleton} />;
  }

  const user = userQuery.data;
  if (userQuery.isError || !user) {
    return (
      <div className={adminUserDetailStyles.emptyBox}>
        <QueryErrorAlert
          error={userQuery.error}
          fallback={adminEntityDetailLabels.userCouldNotLoadDetail}
        />
      </div>
    );
  }

  const addresses = addressesQuery.data ?? [];
  const orders = ordersQuery.data?.items ?? [];

  const userPhoneDisplay = user.phone ?? "—";
  const statusBadgeElement = user.status ? (
    <StatusBadge status={user.status} />
  ) : null;

  const createdAtRow = user.createdAt ? (
    <>
      <dt className={adminUserDetailStyles.dt}>{LABELS.createdAt}</dt>
      <dd className={adminUserDetailStyles.dd}>
        {formatOrderDate(user.createdAt)}
      </dd>
    </>
  ) : null;

  const linkedVendorRow = user.vendorId ? (
    <>
      <dt className={adminUserDetailStyles.dt}>
        {adminEntityDetailLabels.linkedVendor}
      </dt>
      <dd>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/vendors/${user.vendorId}`}>
            {adminEntityDetailLabels.viewVendor}
          </Link>
        </Button>
      </dd>
    </>
  ) : null;

  return (
    <div className={adminUserDetailStyles.pageRoot}>
      <Link href="/admin/users" className={adminUserDetailStyles.backLink}>
        <ArrowLeft size={14} aria-hidden />
        {adminEntityDetailLabels.backToUsers}
      </Link>

      <div className={adminUserDetailStyles.headerRow}>
        <div className={adminUserDetailStyles.headerInfo}>
          <h1 className={adminUserDetailStyles.title}>{user.name}</h1>
          <p className={adminUserDetailStyles.emailText}>{user.email}</p>
        </div>
        {statusBadgeElement}
      </div>

      <div className={adminUserDetailStyles.actionsRow}>
        <ImpersonateUserButton userId={user.id} />
        <ChangeUserRoleDialog
          userId={user.id}
          userName={user.name}
          currentRoleName={user.role}
          currentVendorId={user.vendorId}
        />
      </div>

      <div className={adminUserDetailStyles.gridTwoCols}>
        <section className={adminUserDetailStyles.cardSection}>
          <h2 className={adminUserDetailStyles.cardSectionTitle}>
            {adminEntityDetailLabels.profileDetails}
          </h2>
          <dl className={adminUserDetailStyles.dlGrid}>
            <dt className={adminUserDetailStyles.dt}>{LABELS.role}</dt>
            <dd className={adminUserDetailStyles.ddFlex}>
              <span>{user.role}</span>
              <ChangeUserRoleDialog
                userId={user.id}
                userName={user.name}
                currentRoleName={user.role}
                currentVendorId={user.vendorId}
                trigger={
                  <button
                    type="button"
                    className={adminUserDetailStyles.manageRoleLink}
                  >
                    Edit
                  </button>
                }
              />
            </dd>
            <dt className={adminUserDetailStyles.dt}>{LABELS.phone}</dt>
            <dd className={adminUserDetailStyles.dd}>{userPhoneDisplay}</dd>
            {createdAtRow}
            {linkedVendorRow}
          </dl>
        </section>

        <UserAddressesCard addresses={addresses} />
      </div>

      <UserRecentOrdersCard orders={orders} />
    </div>
  );
}
