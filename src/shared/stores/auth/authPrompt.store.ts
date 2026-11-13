import { create } from "zustand";
import { currentReturnPath } from "@/shared/utils/auth/authReturn";

export interface AuthPromptOptions {
  title?: string;
  message: string;
  /** Path to return to after login. Defaults to current path. */
  redirectTo?: string;
}

interface AuthPromptState {
  open: boolean;
  title: string;
  message: string;
  redirectTo: string | null;
  /** The control that opened the prompt; focus goes back to it on close (B-08). */
  returnFocusTo: HTMLElement | null;
  openPrompt: (options: AuthPromptOptions) => void;
  closePrompt: () => void;
}

const DEFAULT_TITLE = "Sign in to continue";

export const useAuthPromptStore = create<AuthPromptState>((set) => ({
  open: false,
  title: DEFAULT_TITLE,
  message: "",
  redirectTo: null,
  returnFocusTo: null,
  openPrompt: ({ title, message, redirectTo }) =>
    set({
      open: true,
      returnFocusTo:
        typeof document !== "undefined" &&
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null,
      title: title ?? DEFAULT_TITLE,
      message,
      redirectTo: redirectTo ?? currentReturnPath(),
    }),
  closePrompt: () => set({ open: false }),
}));
