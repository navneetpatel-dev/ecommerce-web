"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";
import { useAuthBootstrap } from "@/shared/hooks/useAuthBootstrap";
import { LoginRequiredDialogContainer } from "@/shared/containers/LoginRequiredDialogContainer";
import { RouteScrollResetContainer } from "@/shared/containers/RouteScrollResetContainer";
import { BrowseUrlTrackerContainer } from "@/shared/containers/BrowseUrlTrackerContainer";
import { RoleSurfaceGuard } from "@/shared/components/RoleSurfaceGuard";
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
          dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
              query.state.status === "success" &&
              ["products", "categories", "home", "settings"].includes(
                String(query.queryKey[0]),
              ),
          },
        }}
      >
        <AuthBootstrap />
        <RouteScrollResetContainer />
        <BrowseUrlTrackerContainer />
        <LoginRequiredDialogContainer />
        <RoleSurfaceGuard>{children}</RoleSurfaceGuard>
      </PersistQueryClientProvider>
    </QueryClientProvider>
  );
}
