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
import { formatInr } from "@/shared/utils/orderFormat";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import {
  useAdminUser,
  useAdminUserAddresses,
  useAdminUserOrders,
} from "../api/users.queries";
import { ImpersonateUserButton } from "../components/ImpersonateUserButton.component";
import { ChangeUserRoleDialog } from "../components/ChangeUserRoleDialog.component";

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
    return <DetailQuerySkeleton className="space-y-3 py-4" />;
  }

  const user = userQuery.data;
  if (userQuery.isError || !user) {
    return (
      <div className="border border-line bg-surface-raised px-5 py-10 text-center">
        <QueryErrorAlert
          error={userQuery.error}
          fallback={adminEntityDetailLabels.userCouldNotLoadDetail}
        />
      </div>
    );
  }

  const addresses = addressesQuery.data ?? [];
  const orders = ordersQuery.data?.items ?? [];

  return (
    <div className="w-full min-w-0 space-y-5">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={14} aria-hidden />
        {adminEntityDetailLabels.backToUsers}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {user.name}
          </h1>
          <p className="text-body-sm text-ink-muted">{user.email}</p>
        </div>
        {user.status ? <StatusBadge status={user.status} /> : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ImpersonateUserButton userId={user.id} />
        <ChangeUserRoleDialog
          userId={user.id}
          userName={user.name}
          currentRoleName={user.role}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 border border-line bg-surface-raised p-4">
          <h2 className="text-body-sm font-semibold uppercase tracking-wide text-ink-muted">
            {adminEntityDetailLabels.profileDetails}
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-sm">
            <dt className="text-ink-muted">{LABELS.role}</dt>
            <dd className="flex items-center gap-2 text-ink">
              <span>{user.role}</span>
              <ChangeUserRoleDialog
                userId={user.id}
                userName={user.name}
                currentRoleName={user.role}
                trigger={
                  <button
                    type="button"
                    className="text-xs text-brand underline underline-offset-2 hover:text-brand-hover"
                  >
                    Edit
                  </button>
                }
              />
            </dd>
            <dt className="text-ink-muted">{LABELS.phone}</dt>
            <dd className="text-ink">{user.phone ?? "—"}</dd>
            {user.createdAt ? (
              <>
                <dt className="text-ink-muted">{LABELS.createdAt}</dt>
                <dd className="text-ink">{formatOrderDate(user.createdAt)}</dd>
              </>
            ) : null}
            {user.vendorId ? (
              <>
                <dt className="text-ink-muted">
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
            ) : null}
          </dl>
        </section>

        <section className="space-y-3 border border-line bg-surface-raised p-4">
          <h2 className="text-body-sm font-semibold uppercase tracking-wide text-ink-muted">
            {adminEntityDetailLabels.addressesOnFile}
          </h2>
          {addresses.length === 0 ? (
            <p className="text-body-sm text-ink-muted">
              {adminEntityDetailLabels.noAddressesOnFile}
            </p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((address) => (
                <li key={address.id} className="text-body-sm text-ink">
                  <p>{address.line1}</p>
                  {address.line2 ? <p>{address.line2}</p> : null}
                  <p className="text-ink-muted">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="space-y-3 border border-line bg-surface-raised p-4">
        <h2 className="text-body-sm font-semibold uppercase tracking-wide text-ink-muted">
          {adminEntityDetailLabels.recentOrders}
        </h2>
        {orders.length === 0 ? (
          <p className="text-body-sm text-ink-muted">
            {adminEntityDetailLabels.noOrdersYet}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-body-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-ink-muted">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <p className="tabular-nums text-ink">
                  {formatInr(order.totalAmount)}
                </p>
                <StatusBadge status={order.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
