import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { nextPageOf } from "@/shared/api/client/pagination";
import { vendorsApi } from "./vendors.api";

export const vendorKeys = {
  all: ["vendors"] as const,
  bySlug: (slug: string) => [...vendorKeys.all, "slug", slug] as const,
  byId: (id: string) => [...vendorKeys.all, "id", id] as const,
  storefront: (params: { page?: number; limit?: number; search?: string }) =>
    [...vendorKeys.all, "storefront", params] as const,
};

/** Admin (or vendor-linked) detail fetch by id — distinct from the public `useVendorBySlug`. */
export function useVendorById(id: string | undefined) {
  return useQuery({
    queryKey: vendorKeys.byId(id ?? ""),
    queryFn: () => vendorsApi.getById(id!),
    enabled: Boolean(id),
  });
}

/** Admin-only vendor update (businessName, description, commissionRate, etc — PATCH /vendors/:id). */
export function useUpdateVendor(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof vendorsApi.update>[1]) =>
      vendorsApi.update(id!, body),
    onSuccess: () => {
      if (id)
        void queryClient.invalidateQueries({ queryKey: vendorKeys.byId(id) });
    },
  });
}

export function useVendorBySlug(slug: string) {
  return useQuery({
    queryKey: vendorKeys.bySlug(slug),
    queryFn: () => vendorsApi.getBySlug(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useStorefrontVendors(
  params: { page?: number; limit?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: vendorKeys.storefront(params),
    queryFn: () => vendorsApi.listStorefront(params),
  });
}

/** All shops page: searchable and paged (B-59; it stopped at the first 48). */
export function useStorefrontVendorsInfinite(search: string, limit = 24) {
  return useInfiniteQuery({
    queryKey: [...vendorKeys.all, "storefront-infinite", { search, limit }],
    queryFn: ({ pageParam }) =>
      vendorsApi.listStorefront({
        page: pageParam,
        limit,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
  });
}
