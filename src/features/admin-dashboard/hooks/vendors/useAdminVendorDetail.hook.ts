"use client";

import { useEffect, useState } from "react";
import { useVendorById, useUpdateVendor } from "@/features/vendors";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";

interface VendorEditForm {
  businessName: string;
  description: string;
  commissionRate: number | undefined;
  returnShippingFee: number | undefined;
  codEnabled: boolean;
}

function toForm(vendor: {
  businessName: string;
  description?: string | null;
  commissionRate?: number | null;
  returnShippingFee?: number | null;
  codEnabled?: boolean;
}): VendorEditForm {
  return {
    businessName: vendor.businessName ?? "",
    description: vendor.description ?? "",
    commissionRate: vendor.commissionRate ?? undefined,
    returnShippingFee: vendor.returnShippingFee ?? undefined,
    codEnabled: vendor.codEnabled ?? true,
  };
}

/** Admin vendor-detail state: fetch + editable form + save (PATCH /vendors/:id). */
export function useAdminVendorDetail(vendorId: string | undefined) {
  const query = useVendorById(vendorId);
  const update = useUpdateVendor(vendorId);

  const [form, setForm] = useState<VendorEditForm | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.data) setForm(toForm(query.data));
  }, [query.data]);

  const patchForm = (patch: Partial<VendorEditForm>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
    setMessage(null);
  };

  const save = async () => {
    if (!form) return;
    setError(null);
    setMessage(null);
    try {
      await update.mutateAsync({
        businessName: form.businessName,
        description: form.description,
        commissionRate: form.commissionRate,
        returnShippingFee: form.returnShippingFee ?? null,
        codEnabled: form.codEnabled,
      });
      setMessage(adminEntityDetailLabels.vendorSaved);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          adminEntityDetailLabels.vendorCouldNotLoadDetail,
        ),
      );
    }
  };

  return {
    vendor: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    loadError: query.error,
    form,
    patchForm,
    save,
    saving: update.isPending,
    message,
    error,
  };
}
