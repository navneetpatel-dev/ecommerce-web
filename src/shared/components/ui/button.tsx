"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex box-border items-center justify-center gap-2 overflow-hidden",
    "whitespace-nowrap font-medium leading-none transition-colors cursor-pointer",
    "touch-manipulation outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    /* Locked control height — matches Input / Select on every breakpoint */
    "h-11 min-h-11 max-h-11 py-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border border-transparent bg-ink text-paper hover:bg-ink/90",
        destructive:
          "border border-transparent bg-danger text-paper hover:bg-danger/90",
        /** Stronger edge so outline reads equal height to solid fills in dark mode. */
        outline:
          "border border-line-strong bg-surface text-ink hover:bg-paper hover:text-ink",
        secondary:
          "border border-line-strong bg-surface text-ink hover:bg-paper",
        ghost: "border border-transparent hover:bg-brand-subtle hover:text-ink",
        link: "border border-transparent text-brand underline-offset-4 hover:underline",
      },
      size: {
        /**
         * Project control height is fixed at 44px for all sizes.
         * Size only changes horizontal padding / icon density.
         * Table row menus override via TABLE_ROW_MENU_BUTTON_LAYOUT.
         */
        default:
          "rounded-md px-4 text-[0.875rem] sm:px-5 sm:text-body [&_svg]:!size-4",
        sm: "rounded-md px-4 text-[0.875rem] sm:px-5 sm:text-body [&_svg]:!size-4",
        lg: "rounded-md px-4 text-[0.875rem] sm:px-5 sm:text-body [&_svg]:!size-4",
        icon: "w-11 shrink-0 rounded-md px-0 [&_svg]:!size-4",
        "icon-sm": "w-11 shrink-0 rounded-md px-0 [&_svg]:!size-4",
      },
      fullWidth: {
        true: "w-full",
        /** Full width below `sm`, intrinsic width from `sm` up — use in toolbars / page actions. */
        mobile: "w-full sm:w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean | "mobile";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedFullWidth =
      fullWidth === true ? true : fullWidth === "mobile" ? "mobile" : undefined;

    const spinner = (
      <svg
        className="h-4 w-4 shrink-0 animate-spin"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );

    const isDisabled = disabled || loading;
    const ariaBusy = loading ? true : undefined;
    const dataSize = size ?? "default";
    const spinnerOrNull = loading ? spinner : null;
    const content = asChild ? (
      children
    ) : (
      <>
        {spinnerOrNull}
        {children}
      </>
    );

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth: resolvedFullWidth }),
          className,
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={ariaBusy}
        data-size={dataSize}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
