"use client";

import { BellRing, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";
import { useNotifyMe } from "../hooks/useNotifyMe.hook";

interface NotifyMeButtonProps {
  variantId: string | null | undefined;
  className?: string;
}

/** "Notify me" CTA for an out-of-stock variant — subscribes the shopper (or a guest
 * email) to a back-in-stock alert. Used on the PDP buy box and the wishlist grid. */
export function NotifyMeButton({ variantId, className }: NotifyMeButtonProps) {
  const {
    status,
    email,
    setEmail,
    emailError,
    isPending,
    errorMessage,
    onNotifyClick,
    onSubmitEmail,
    onCancel,
  } = useNotifyMe(variantId);

  if (!variantId) return null;

  if (status === "subscribed") {
    return (
      <p
        className={`flex items-center gap-1.5 text-body-sm text-success ${className ?? ""}`}
      >
        <Check size={14} className="shrink-0" />
        {stockAlertsLabels.notifyMeSubscribed}
      </p>
    );
  }

  if (status === "awaiting-email") {
    return (
      <div className={`space-y-1.5 ${className ?? ""}`}>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={stockAlertsLabels.notifyMeEmailPlaceholder}
            error={Boolean(emailError)}
          />
          <Button
            type="button"
            size="sm"
            onClick={onSubmitEmail}
            loading={isPending}
          >
            {stockAlertsLabels.notifyMeSubmit}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            {stockAlertsLabels.notifyMeCancel}
          </Button>
        </div>
        {emailError ? (
          <p role="alert" className="text-body-sm text-danger">
            {emailError}
          </p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="text-body-sm text-danger">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNotifyClick}
        loading={isPending}
      >
        <BellRing size={14} />
        {stockAlertsLabels.notifyMe}
      </Button>
      {status === "error" && errorMessage ? (
        <p role="alert" className="mt-1.5 text-body-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
