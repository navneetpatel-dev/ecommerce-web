"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS, VENDOR_ROLES } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import {
  VendorRegisterSchema,
  type VendorRegisterInput,
} from "../../schemas/register/vendor.schema";
import { useVendorRegistration } from "./useVendorRegistration.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";

export function useVendorRegisterPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const { requireAuth } = useRequireAuth();
  const register = useVendorRegistration();

  useEffect(() => {
    const isVendor =
      (currentUser?.role &&
        (VENDOR_ROLES as readonly string[]).includes(currentUser.role)) ||
      Boolean(currentUser?.vendorId);
    if (isVendor) {
      router.replace(PATHS.vendor.overview);
    }
  }, [currentUser?.role, currentUser?.vendorId, router]);
  const form = useForm<VendorRegisterInput>({
    mode: "onTouched",
    resolver: zodResolver(VendorRegisterSchema),
    defaultValues: {
      businessName: "",
      categoryIds: [],
      description: "",
      gstNumber: "",
      panHolderName: "",
      bankAccountHolderName: "",
    },
  });

  useUnsavedChanges(form.formState.isDirty);

  const { formLevelError } = useApiFormErrors(
    form,
    register.error,
    LABELS.registrationFailed,
  );

  return {
    form,
    error: formLevelError,
    isPending: register.isPending,
    onSubmit: (data: VendorRegisterInput) => {
      if (register.isPending) return;
      if (!requireAuth(LABELS.loginToContinueNotice)) return;
      register.mutate(data);
    },
  };
}
