"use client";

import { useRouter } from "next/navigation";
import { LoginRequiredDialog } from "@/shared/components/LoginRequiredDialog.component";
import { useAuthPromptStore } from "@/shared/stores/authPrompt.store";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";

export function LoginRequiredDialogContainer() {
  const router = useRouter();
  const open = useAuthPromptStore((s) => s.open);
  const title = useAuthPromptStore((s) => s.title);
  const message = useAuthPromptStore((s) => s.message);
  const redirectTo = useAuthPromptStore((s) => s.redirectTo);
  const closePrompt = useAuthPromptStore((s) => s.closePrompt);

  const goToLogin = () => {
    closePrompt();
    const next =
      redirectTo && redirectTo !== PATHS.login ? redirectTo : PATHS.home;
    navigate(router, PATHS.loginWithRedirect(next));
  };

  return (
    <LoginRequiredDialog
      open={open}
      title={title}
      message={message}
      onOpenChange={(next) => {
        if (!next) closePrompt();
      }}
      onCancel={closePrompt}
      onLogin={goToLogin}
    />
  );
}
