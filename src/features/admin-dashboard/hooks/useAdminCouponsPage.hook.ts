"use client";

import { useState } from "react";
import { useAdminCoupons } from "../api/admin.queries";
import { useCreateCoupon } from "./useCreateCoupon.hook";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import type { CouponFormInput } from "../schemas/coupons.schema";

export type CouponsTab = "platform" | "vendor";

export function useAdminCouponsPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<CouponsTab>("platform");
  const vendorScoped = tab === "vendor";
  const { data, isLoading } = useAdminCoupons(
    page,
    DEFAULT_PAGE_LIMIT,
    vendorScoped,
  );
  const { open, setOpen, createCoupon, form } = useCreateCoupon();

  const coupons = data?.items ?? [];
  const limit = data?.limit ?? DEFAULT_PAGE_LIMIT;
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const from = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  const selectTab = (next: CouponsTab) => {
    setTab(next);
    setPage(1);
  };
  const onSubmit = (data: CouponFormInput) => createCoupon.mutate(data);

  return {
    tab,
    setTab: selectTab,
    coupons,
    isLoading,
    pagination: {
      page: currentPage,
      totalPages: data?.totalPages ?? 1,
      total,
      from,
      to,
      onPageChange: setPage,
    },
    open,
    setOpen,
    form,
    isPending: createCoupon.isPending,
    onSubmit,
  };
}
