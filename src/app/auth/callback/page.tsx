import { Suspense } from "react";
import { OAuthCallbackPage } from "@/features/auth";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackPage />
    </Suspense>
  );
}
