"use client";

import {
  BookOpen,
  LifeBuoy,
  Package,
  RotateCcw,
  CreditCard,
  UserRound,
  Store,
  Shield,
  Wrench,
  Truck,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  UserRound,
  Store,
  Shield,
  Wrench,
  LifeBuoy,
};

export function CategoryIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? LifeBuoy;
  return (
    <Icon size={18} strokeWidth={1.5} className="text-brand" aria-hidden />
  );
}
