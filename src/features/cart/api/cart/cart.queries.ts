import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { cartApi } from "./cart.api";

export const cartKeys = {
  all: ["cart"] as const,
  /** Separate cache buckets so a pre-auth empty guest cart cannot stick after login/hydrate. */
  forAuth: (accessToken: string | null) =>
    [...cartKeys.all, accessToken ? "user" : "guest"] as const,
};

export function useCart() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);

  return useQuery({
    queryKey: cartKeys.forAuth(accessToken),
    queryFn: () => cartApi.get(),
    // Wait until localStorage auth is restored so refresh does not GET /cart as a new guest.
    enabled: authBootstrapped,
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
}

// Re-exported for existing "../api/cart.queries" import sites — the
// mutation hooks live in ./cart.mutations, split out to stay under the
// per-file line ceiling.
export {
  cartMutationKeys,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "./cart.mutations";
