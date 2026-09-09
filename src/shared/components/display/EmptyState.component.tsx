"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { emptyStateStyles } from "./displayComponents.styles";

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
  maxWidth = emptyStateStyles.defaultMaxWidth,
}: EmptyStateProps) {
  const hasPrimary = Boolean(actionLabel && (actionTo || onAction));
  const hasSecondary = Boolean(
    secondaryAction?.label && (secondaryAction.href || secondaryAction.onClick),
  );

  return (
    <div className={cn(emptyStateStyles.container, maxWidth, className)}>
      {Icon ? (
        <div className={emptyStateStyles.iconWrap}>
          <Icon
            className={cn(emptyStateStyles.icon, iconClassName)}
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      ) : null}

      {eyebrow ? <p className={emptyStateStyles.eyebrow}>{eyebrow}</p> : null}

      {heading ? (
        <h3
          className={emptyStateStyles.heading}
          style={{ fontSize: "var(--text-h3)", lineHeight: 1.25 }}
        >
          {heading}
        </h3>
      ) : null}

      <p
        className={cn(
          emptyStateStyles.message,
          heading ? emptyStateStyles.messageWithHeading : undefined,
        )}
        style={{ fontSize: "var(--text-body)", lineHeight: 1.55 }}
      >
        {message}
      </p>

      {hasPrimary || hasSecondary ? (
        <div className={emptyStateStyles.actions}>
          {hasPrimary ? (
            <Button
              variant="default"
              className={emptyStateStyles.button}
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
              className={emptyStateStyles.button}
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
