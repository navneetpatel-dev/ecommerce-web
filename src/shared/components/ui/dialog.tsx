"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 animate-fade-in bg-overlay", className)}
    style={{ animationDuration: "var(--motion-moderate)" }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    presentation?: "default" | "fullscreen";
  }
>(
  (
    {
      className,
      children,
      presentation = "default",
      onCloseAutoFocus,
      onPointerDownOutside,
      onEscapeKeyDown,
      ...props
    },
    ref,
  ) => {
    const closedByPointerRef = React.useRef(false);
    const isFullscreen = presentation === "fullscreen";

    return (
      <DialogPortal>
        <DialogOverlay />
        {/* Flex centering avoids transform-based fixed positioning, which can
            enlarge document overflow and leave a page scrollbar beside the modal. */}
        <div
          className={cn(
            "fixed inset-0 z-50 pointer-events-none",
            isFullscreen ? "p-0" : "flex items-center justify-center p-4",
          )}
        >
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "pointer-events-auto overscroll-contain outline-none animate-scale-in",
              isFullscreen
                ? "fixed inset-0 flex h-[100dvh] w-full max-h-none max-w-none flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none rounded-none"
                : "relative grid w-full max-w-[480px] max-h-full gap-5 overflow-y-auto border border-line bg-surface-raised p-5 shadow-elevation-3 rounded-lg sm:gap-6 sm:p-6",
              className,
            )}
            style={{ animationDuration: "var(--motion-moderate)" }}
            onPointerDownOutside={(event) => {
              closedByPointerRef.current = true;
              onPointerDownOutside?.(event);
            }}
            onEscapeKeyDown={(event) => {
              closedByPointerRef.current = false;
              onEscapeKeyDown?.(event);
            }}
            onCloseAutoFocus={(event) => {
              onCloseAutoFocus?.(event);
              if (event.defaultPrevented) return;
              if (closedByPointerRef.current) {
                event.preventDefault();
              }
              closedByPointerRef.current = false;
            }}
            {...props}
          >
            {children}
            <DialogPrimitive.Close
              type="button"
              className={cn(
                "rounded-sm opacity-70 outline-none hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                isFullscreen
                  ? "fixed right-3 top-3 z-[60] rounded-full border border-line bg-surface/90 p-2 opacity-100 shadow-elevation-1 backdrop-blur-sm"
                  : "absolute right-4 top-4",
              )}
              onPointerDown={(event) => {
                // Keep focus in the dialog until close so field blur doesn't flash validation.
                event.preventDefault();
                closedByPointerRef.current = true;
              }}
            >
              <X size={20} />
              <span className="sr-only">{LABELS.close}</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </div>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn("dialog-footer", className)}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[1.375rem] font-semibold leading-tight tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-body-sm text-ink-muted", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
