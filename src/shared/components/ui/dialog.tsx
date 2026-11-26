"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useScrollAlertsIntoView } from "@/shared/hooks/ui/useScrollAlertsIntoView.hook";
import { IconCloseButton } from "./icon-close-button";
import { cn } from "@/shared/utils/dom/cn";
import { dialogStyles } from "../../styles/ui/dialog.styles";

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
    className={cn(dialogStyles.overlay, className)}
    style={{ animationDuration: "var(--motion-moderate)" }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * The dialog scrolls its own body (`dialogStyles.bodyBase`). A caller passing `overflow-y-auto` to the
 * dialog box as well produced two scrollbars and a scroll area with empty space below the content, so
 * those classes are dropped here, once, for every dialog in the app.
 */
const OWN_SCROLL_CLASS = /^(?:[a-z]+:)*overflow(?:-y)?-(?:auto|scroll)$/;
export function withoutOwnScroll(className?: string): string | undefined {
  return className
    ?.split(/\s+/)
    .filter((token) => token && !OWN_SCROLL_CLASS.test(token))
    .join(" ");
}

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
    // An error appearing below the fold (after Save) scrolls into view.
    const bodyRef = useScrollAlertsIntoView<HTMLDivElement>();
    const isFullscreen = presentation === "fullscreen";

    const closeButtonElement = !hideCloseButton && (
      <div
        className={cn(
          dialogStyles.closeButtonWrap,
          isFullscreen
            ? dialogStyles.closeButtonWrapFullscreen
            : dialogStyles.closeButtonWrapDefault,
        )}
      >
        <DialogPrimitive.Close asChild>
          <IconCloseButton
            variant={isFullscreen ? "floating" : "dialog"}
            className={closeButtonClassName}
            onPointerDown={(event) => {
              // Keep focus in the dialog until close so field blur doesn't flash validation.
              event.preventDefault();
              closedByPointerRef.current = true;
            }}
          />
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
            dialogStyles.portalWrap,
            isFullscreen
              ? dialogStyles.portalWrapFullscreen
              : dialogStyles.portalWrapDefault,
          )}
        >
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              dialogStyles.contentBase,
              isFullscreen
                ? dialogStyles.contentFullscreen
                : dialogStyles.contentDefault,
              withoutOwnScroll(className),
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
              ref={bodyRef}
              className={cn(
                dialogStyles.bodyBase,
                !className?.includes("p-0") && dialogStyles.bodyPadding,
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
  <div className={cn(dialogStyles.header, className)} {...props} />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn(dialogStyles.footer, className)}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(dialogStyles.title, className)}
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
    className={cn(dialogStyles.description, className)}
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
