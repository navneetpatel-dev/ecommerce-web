"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";
import { useAuthBootstrap } from "@/features/auth";
import { LoginRequiredDialogContainer } from "@/shared/containers/LoginRequiredDialogContainer";
import { RouteScrollResetContainer } from "@/shared/containers/RouteScrollResetContainer";
import { BrowseUrlTrackerContainer } from "@/shared/containers/BrowseUrlTrackerContainer";
import { RoleSurfaceGuard } from "@/shared/components/RoleSurfaceGuard";
import { ThemePaletteProvider } from "@/shared/context/ThemePalette.context";
import { ErrorReportingProvider } from "@/shared/providers/ErrorReportingProvider";
import { createQueryPersister } from "@/shared/api/queryPersister";

function AuthBootstrap() {
  useAuthBootstrap();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [persister] = useState(() => createQueryPersister());

  return (
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 24 * 60 * 60 * 1000,
          buster: QUERY_CACHE_BUSTER,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
              query.state.status === "success" &&
              ["products", "categories", "home", "settings"].includes(
                String(query.queryKey[0]),
              ),
          },
        }}
      >
        <ThemePaletteProvider>
          <ErrorReportingProvider />
          <AuthBootstrap />
          <RouteScrollResetContainer />
          <BrowseUrlTrackerContainer />
          <LoginRequiredDialogContainer />
          <RoleSurfaceGuard>{children}</RoleSurfaceGuard>
        </ThemePaletteProvider>
      </PersistQueryClientProvider>
    </QueryClientProvider>
  );
}

/**
 * Bump when a persisted cache shape changes so stale entries are discarded
 * on restore instead of being rehydrated for up to maxAge (§11).
 */
const QUERY_CACHE_BUSTER = "v1";
