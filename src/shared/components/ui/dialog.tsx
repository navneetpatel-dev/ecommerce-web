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
    hideCloseButton?: boolean;
    closeButtonClassName?: string;
  }
>(
  (
    {
      className,
      children,
      presentation = "default",
      hideCloseButton = false,
      closeButtonClassName,
      onCloseAutoFocus,
      onPointerDownOutside,
      onEscapeKeyDown,
      ...props
    },
    ref,
  ) => {
    const closedByPointerRef = React.useRef(false);
    const isFullscreen = presentation === "fullscreen";

    const closeButtonElement = !hideCloseButton && (
      <div
        className={cn(
          "flex shrink-0 items-center justify-end",
          isFullscreen ? "fixed right-3 top-3 z-[60]" : "px-3 pt-2.5 pb-0.5",
        )}
      >
        <DialogPrimitive.Close
          type="button"
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-sm text-ink-muted opacity-70 transition-all hover:bg-surface hover:text-ink hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            isFullscreen &&
              "rounded-full border border-line bg-surface/90 p-2 opacity-100 shadow-elevation-1 backdrop-blur-sm",
            closeButtonClassName,
          )}
          onPointerDown={(event) => {
            // Keep focus in the dialog until close so field blur doesn't flash validation.
            event.preventDefault();
            closedByPointerRef.current = true;
          }}
        >
          <X size={18} />
          <span className="sr-only">{LABELS.close}</span>
        </DialogPrimitive.Close>
      </div>
    );

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
              "pointer-events-auto overscroll-contain outline-none animate-scale-in flex flex-col",
              isFullscreen
                ? "fixed inset-0 flex h-[100dvh] w-full max-h-none max-w-none flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none rounded-none"
                : "relative w-full max-w-[480px] max-h-[calc(100dvh-2rem)] overflow-hidden border border-line bg-surface-raised shadow-elevation-3 rounded-lg",
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
            {closeButtonElement}
            <div
              className={cn(
                "min-h-0 flex-1 flex flex-col overflow-y-auto",
                !className?.includes("p-0") &&
                  "px-5 pb-5 sm:px-6 sm:pb-6 gap-5 sm:gap-6",
              )}
            >
              {children}
            </div>
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
