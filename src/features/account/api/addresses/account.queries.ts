import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { Address, CurrentUser } from "@/shared/api/types";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import { useUploadFile } from "@/features/uploads";
import { accountApi } from "./account.api";
import type { UpdateProfileBody, AddressInput } from "@/features/users";

export const accountKeys = {
  profile: ["account", "profile"] as const,
};

/** Shared with checkout — keep both surfaces in sync. */
export const ADDRESS_QUERY_KEY = ["addresses"] as const;

function syncAuthUser(profile: CurrentUser) {
  const accessToken = useAuthStore.getState().accessToken;
  const currentUser = useAuthStore.getState().currentUser;
  if (!accessToken || !currentUser) return;

  const next = {
    ...currentUser,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    emailMarketingConsent: profile.emailMarketingConsent,
    emailVerified: profile.emailVerified,
    avatarUrl: profile.avatarUrl,
    createdAt: profile.createdAt,
  };
  useAuthStore.getState().setSession(accessToken, next);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(next));
  }
}

export function useAccountProfile() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: accountKeys.profile,
    queryFn: () => accountApi.getProfile(),
    enabled: Boolean(accessToken),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => accountApi.updateProfile(body),
    onSuccess: (profile) => {
      queryClient.setQueryData(accountKeys.profile, profile);
      syncAuthUser(profile);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const uploadFile = useUploadFile();

  return useMutation({
    mutationFn: async ({
      userId,
      dataUrl,
      filename,
    }: {
      userId: string;
      dataUrl: string;
      filename?: string;
    }) => {
      const uploaded = await uploadFile.mutateAsync({
        entityType: UPLOAD_ENTITY.USERS,
        entityId: userId,
        purpose: UPLOAD_PURPOSE.AVATAR,
        file: { dataUrl, filename: filename ?? "avatar.jpg" },
      });
      return accountApi.updateProfile({ avatarUrl: uploaded.url });
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(accountKeys.profile, profile);
      syncAuthUser(profile);
    },
  });
}

export function useExportAccount() {
  return useMutation({
    mutationFn: () => accountApi.exportAccount(),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => accountApi.deleteAccount(),
  });
}

export function useAccountAddresses() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: () => accountApi.getAddresses(),
    enabled: Boolean(accessToken),
  });
}

function patchAddressCache(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (list: Address[]) => Address[],
  options?: { revalidate?: boolean },
) {
  queryClient.setQueryData<Address[]>(ADDRESS_QUERY_KEY, (prev) =>
    updater(prev ?? []),
  );
  if (options?.revalidate !== false) {
    void queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
  }
}

export function useCreateAccountAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddressInput) => accountApi.createAddress(body),
    onSuccess: (created) => {
      patchAddressCache(queryClient, (list) => {
        const without = list.filter((a) => a.id !== created.id);
        if (created.isDefault) {
          return [created, ...without.map((a) => ({ ...a, isDefault: false }))];
        }
        return [created, ...without];
      });
    },
  });
}

export function useUpdateAccountAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      addressId,
      body,
    }: {
      addressId: string;
      body: Partial<AddressInput>;
    }) => accountApi.updateAddress(addressId, body),
    onSuccess: (updated) => {
      patchAddressCache(queryClient, (list) => {
        const next = list.map((a) => (a.id === updated.id ? updated : a));
        if (updated.isDefault) {
          return next.map((a) =>
            a.id === updated.id ? a : { ...a, isDefault: false },
          );
        }
        return next;
      });
    },
  });
}

export function useDeleteAccountAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => accountApi.deleteAddress(addressId),
    onSuccess: (_void, addressId) => {
      patchAddressCache(queryClient, (list) =>
        list.filter((a) => a.id !== addressId),
      );
    },
  });
}

export function useSetDefaultAccountAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => accountApi.setDefaultAddress(addressId),
    onSuccess: (updated) => {
      patchAddressCache(
        queryClient,
        (list) =>
          list.map((a) => ({
            ...a,
            isDefault: a.id === updated.id,
          })),
        { revalidate: false },
      );
    },
  });
}
