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
  const returnFocusTo = useAuthPromptStore((s) => s.returnFocusTo);

  // Back to the heart (or whatever opened the prompt) instead of the page body.
  const handleCloseAutoFocus = (event: Event) => {
    if (!returnFocusTo?.isConnected) return;
    event.preventDefault();
    returnFocusTo.focus();
  };

  const goToRegister = () => {
    closePrompt();
    const next =
      redirectTo && redirectTo !== PATHS.login ? redirectTo : PATHS.home;
    navigate(router, PATHS.registerWithRedirect(next));
  };

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
      onRegister={goToRegister}
      onCloseAutoFocus={handleCloseAutoFocus}
    />
  );
}
