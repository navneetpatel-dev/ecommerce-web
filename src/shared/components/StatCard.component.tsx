import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/shared/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string | ReactNode;
  icon?: LucideIcon;
  valueClassName?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  valueClassName,
  isLoading,
  size = "md",
}: StatCardProps) {
  const sizeClasses = {
    sm: "text-[1.375rem]",
    md: "text-[1.75rem]",
    lg: "text-[1.75rem]",
  };

  const headerLayout = cn(Icon && "flex-row items-center justify-between pb-2");
  const titleTone = cn(Icon ? "text-body-sm font-normal text-ink-muted" : "");

  return (
    <Card>
      <CardHeader className={headerLayout}>
        <CardTitle className={titleTone}>{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-ink-faint" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <p
            className={cn(
              "font-mono font-bold",
              sizeClasses[size],
              valueClassName,
            )}
          >
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
