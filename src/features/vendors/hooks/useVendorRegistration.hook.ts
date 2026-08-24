import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { vendorsApi } from "../api/vendors.api";
import { authApi } from "@/features/auth";
import { useAuthStore } from "@/shared/stores/auth.store";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import type { VendorRegisterInput } from "../schemas/vendor.schema";
import type { CurrentUser } from "@/shared/api/types";

function persistSession(accessToken: string, user: CurrentUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
}

export function useVendorRegistration() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (body: VendorRegisterInput) => {
      const result = await vendorsApi.register({
        businessName: body.businessName,
        entityType: body.entityType,
        categoryIds: body.categoryIds,
        gstNumber: body.gstNumber,
        description: body.description,
        panHolderName: body.panHolderName,
        bankAccountHolderName: body.bankAccountHolderName,
        bankDetails: {},
      });

      // Role upgraded to VENDOR_OWNER on the server — refresh client session.
      const refreshed = await authApi.refresh();
      const me = await authApi.me();
      const previous = useAuthStore.getState().currentUser;
      const nextUser: CurrentUser = {
        ...previous,
        ...me,
        phone: me.phone ?? previous?.phone ?? null,
        emailVerified: me.emailVerified ?? previous?.emailVerified ?? false,
      };
      setSession(refreshed.accessToken, nextUser);
      persistSession(refreshed.accessToken, nextUser);

      if (result.nameMismatchWarning && typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEYS.KYC_NAME_MISMATCH_WARNING, "1");
      }

      return result;
    },
    onSuccess: () => navigate(router, PATHS.vendor.shopSettings),
  });
}
