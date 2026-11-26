"use client";

import type { CashbackOffer } from "@/features/cashback";
import { DataTable } from "@/shared/components/DataTable";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { CashbackOfferDialog } from "../../components/cashback-offers/CashbackOfferDialog.component";
import { CashbackOfferRowActions } from "../../components/cashback-offers/CashbackOfferRowActions.component";
import { useAdminCashbackOffersPage } from "../../hooks/cashback-offers/useAdminCashbackOffersPage.hook";
import { adminCashbackOffersStyles as styles } from "../../styles/cashback-offers/adminCashbackOffers.styles";

const getRowId = (row: CashbackOffer) => row.id;

export function AdminCashbackOffersPage() {
  return (
    <RequirePermission permission={PERMISSIONS.CASHBACK_MANAGE}>
      <AdminCashbackOffersContent />
    </RequirePermission>
  );
}

function AdminCashbackOffersContent() {
  const page = useAdminCashbackOffersPage();
  const renderActions = (row: CashbackOffer) => (
    <CashbackOfferRowActions offer={row} onDelete={page.handleDelete} />
  );

  return (
    <div className={styles.root}>
      <header className={styles.headerRow}>
        <div className={styles.headerInfo}>
          <h1 className={styles.heading}>{LABELS.adminCashbackOffers}</h1>
          <p className={styles.description}>
            {LABELS.adminCashbackOffersDescription}
          </p>
        </div>
        <CashbackOfferDialog />
      </header>

      <CollapsibleTableFilters
        activeCount={page.filters.activeCount}
        onClear={page.filters.onClear}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame
            label={LABELS.search}
            htmlFor="cashback-offers-filter-search"
          >
            <Input
              id="cashback-offers-filter-search"
              value={page.filters.search}
              onChange={(e) => page.filters.onSearchChange(e.target.value)}
              placeholder="Search by offer title..."
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.status}
            htmlFor="cashback-offers-filter-status"
          >
            <Select
              value={page.filters.status || "__ALL__"}
              onValueChange={(val) =>
                page.filters.onStatusChange(val === "__ALL__" ? "" : val)
              }
            >
              <SelectTrigger id="cashback-offers-filter-status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <DataTable
        ariaLabel={LABELS.cashbackOffersTableAria}
        columns={page.columns}
        rows={page.rows}
        getRowId={getRowId}
        loading={page.loading}
        refreshing={page.refreshing}
        error={page.error}
        pagination={page.pagination}
        actions={renderActions}
        fetchRowDetail={async (row) =>
          row as unknown as Record<string, unknown>
        }
      />
    </div>
  );
}
