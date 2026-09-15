import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/shared/components/ui/toast";

interface ErrorToastProps {
  open: boolean;
  message: string;
  /** Changes on every new error — forces Radix to remount the toast (instead of just updating its
   * text) so its auto-dismiss timer restarts for the new message rather than inheriting whatever
   * time was left on the previous one. */
  toastKey: number;
  onOpenChange: (open: boolean) => void;
}

/** Presentational only — see ErrorToastContainer for the store wiring. */
export function ErrorToast({
  open,
  message,
  toastKey,
  onOpenChange,
}: ErrorToastProps) {
  return (
    <ToastProvider duration={6000}>
      <Toast key={toastKey} open={open} onOpenChange={onOpenChange}>
        <ToastDescription>{message}</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
