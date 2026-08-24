"use client";

import { useVendorBySlug } from "../api/vendors.queries";
import { useProductList } from "@/features/products";
import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES } from "@/shared/constants/errors";

export function useVendorStorefrontPage(slug: string) {
  const {
    data: vendor,
    isLoading: vendorLoading,
    error: vendorError,
  } = useVendorBySlug(slug);

  const vendorNotFound =
    vendorError instanceof ApiError &&
    vendorError.code === ERROR_CODES.NOT_FOUND;

  const { data: productsData, isFetching: productsLoading } = useProductList({
    vendorId: vendor?.id,
  });

  const products = productsData?.items ?? [];

  return {
    vendor,
    vendorLoading,
    vendorNotFound,
    products,
    productsLoading,
  };
}
