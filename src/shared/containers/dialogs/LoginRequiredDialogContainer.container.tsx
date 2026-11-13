"use client";

import { useRouter } from "next/navigation";
import { LoginRequiredDialog } from "@/shared/components/dialogs/LoginRequiredDialog.component";
import { useAuthPromptStore } from "@/shared/stores/auth/authPrompt.store";
import { navigate } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";
import {
  rememberAuthReturnScroll,
  safeReturnPath,
} from "@/shared/utils/auth/authReturn";

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

  // Where to come back to after signing in, and where on that page (scroll).
  const prepareReturn = () => {
    closePrompt();
    const safe = safeReturnPath(redirectTo);
    const next = safe && !safe.startsWith(PATHS.login) ? safe : PATHS.home;
    rememberAuthReturnScroll(next);
    return next;
  };

  const goToRegister = () => {
    navigate(router, PATHS.registerWithRedirect(prepareReturn()));
  };

  const goToLogin = () => {
    navigate(router, PATHS.loginWithRedirect(prepareReturn()));
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
