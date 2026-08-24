"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "./ui/button";
import { cn } from "@/shared/utils/cn";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
}

interface EmptyStateProps {
  message: string;
  heading?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  /** Optional second CTA (e.g. browse parent + full catalog). */
  secondaryAction?: EmptyStateAction;
  className?: string;
  maxWidth?: string;
}

export function EmptyState({
  message,
  heading,
  eyebrow,
  icon: Icon,
  iconClassName,
  actionLabel,
  actionTo,
  onAction,
  secondaryAction,
  className,
  maxWidth = "max-w-md",
}: EmptyStateProps) {
  const hasPrimary = Boolean(actionLabel && (actionTo || onAction));
  const hasSecondary = Boolean(
    secondaryAction?.label && (secondaryAction.href || secondaryAction.onClick),
  );

  return (
    <div
      className={cn(
        "mx-auto flex flex-col items-center px-4 py-12 text-center md:py-16",
        maxWidth,
        className,
      )}
    >
      {Icon ? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface shadow-elevation-1">
          <Icon
            className={cn("h-5 w-5 text-ink-muted", iconClassName)}
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      ) : null}

      {eyebrow ? <p className="text-eyebrow mb-2">{eyebrow}</p> : null}

      {heading ? (
        <h3
          className="font-display font-semibold tracking-tight text-ink"
          style={{ fontSize: "var(--text-h3)", lineHeight: 1.25 }}
        >
          {heading}
        </h3>
      ) : null}

      <p
        className={cn(
          "max-w-[36ch] text-ink-muted",
          heading ? "mt-2" : undefined,
        )}
        style={{ fontSize: "var(--text-body)", lineHeight: 1.55 }}
      >
        {message}
      </p>

      {hasPrimary || hasSecondary ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {hasPrimary ? (
            <Button
              variant="default"
              className="min-w-[9.5rem]"
              asChild={Boolean(actionTo)}
              onClick={onAction}
            >
              {actionTo ? (
                <Link href={actionTo}>{actionLabel}</Link>
              ) : (
                actionLabel
              )}
            </Button>
          ) : null}
          {hasSecondary ? (
            <Button
              variant={secondaryAction!.variant ?? "secondary"}
              className="min-w-[9.5rem]"
              asChild={Boolean(secondaryAction!.href)}
              onClick={secondaryAction!.onClick}
            >
              {secondaryAction!.href ? (
                <Link href={secondaryAction!.href}>
                  {secondaryAction!.label}
                </Link>
              ) : (
                secondaryAction!.label
              )}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
