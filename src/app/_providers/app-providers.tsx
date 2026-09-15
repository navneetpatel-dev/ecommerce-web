"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";
import { useAuthBootstrap, ImpersonationBanner } from "@/features/auth";
import { LoginRequiredDialogContainer } from "@/shared/containers/dialogs/LoginRequiredDialogContainer.container";
import { ErrorToastContainer } from "@/shared/containers/notifications/ErrorToastContainer.container";
import { RouteScrollResetContainer } from "@/shared/containers/navigation/RouteScrollResetContainer.container";
import { BrowseUrlTrackerContainer } from "@/shared/containers/system/BrowseUrlTrackerContainer.container";
import { RoleSurfaceGuard } from "@/shared/components/RoleSurfaceGuard.component";
import { ThemePaletteProvider } from "@/shared/context/ThemePalette.context";
import { ErrorReportingProvider } from "@/shared/providers/ErrorReportingProvider";
import { createQueryPersister } from "@/shared/api/client/queryPersister";
import { ServiceWorkerRegistration } from "@/shared/components/ServiceWorkerRegistration.component";

function AuthBootstrap() {
  useAuthBootstrap();
  return null;
}

const PERSISTED_QUERY_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DEHYDRATED_QUERY_KEYS = ["products", "categories", "home", "settings"];

function shouldDehydrateQuery(query: {
  state: { status: string };
  queryKey: readonly unknown[];
}) {
  return (
    query.state.status === "success" &&
    DEHYDRATED_QUERY_KEYS.includes(String(query.queryKey[0]))
  );
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

  const persistOptions = {
    persister,
    maxAge: PERSISTED_QUERY_CACHE_MAX_AGE_MS,
    buster: QUERY_CACHE_BUSTER,
    dehydrateOptions: { shouldDehydrateQuery },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
      >
        <ThemePaletteProvider>
          <ErrorReportingProvider />
          <ServiceWorkerRegistration />
          <AuthBootstrap />
          <RouteScrollResetContainer />
          <BrowseUrlTrackerContainer />
          <LoginRequiredDialogContainer />
          <ErrorToastContainer />
          <ImpersonationBanner />
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
