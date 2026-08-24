import { create } from "zustand";

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
  openPrompt: (options: AuthPromptOptions) => void;
  closePrompt: () => void;
}

const DEFAULT_TITLE = "Sign in to continue";

export const useAuthPromptStore = create<AuthPromptState>((set) => ({
  open: false,
  title: DEFAULT_TITLE,
  message: "",
  redirectTo: null,
  openPrompt: ({ title, message, redirectTo }) =>
    set({
      open: true,
      title: title ?? DEFAULT_TITLE,
      message,
      redirectTo:
        redirectTo ??
        (typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/"),
    }),
  closePrompt: () => set({ open: false }),
}));
