"use client";

import { useRouter } from "next/navigation";
import { LoginRequiredDialog } from "@/shared/components/dialogs/LoginRequiredDialog.component";
import { useAuthPromptStore } from "@/shared/stores/auth/authPrompt.store";
import { navigate } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";

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

  const handleOpenChange = (next: boolean) => {
    if (!next) closePrompt();
  };

  return (
    <LoginRequiredDialog
      open={open}
      title={title}
      message={message}
      onOpenChange={handleOpenChange}
      onCancel={closePrompt}
      onLogin={goToLogin}
    />
  );
}
