import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

/** Nested under (storefront) layout — do not wrap StorefrontLayout again. */
export default function StorefrontNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-paper p-8 lg:min-h-[calc(100vh-72px)]">
      <PackageSearch size={160} className="text-ink-faint" strokeWidth={1} />
      <h1
        className="font-display text-ink"
        style={{ fontSize: "var(--text-display-sm)" }}
      >
        {LABELS.pageNotFound}
      </h1>
      <p className="max-w-sm text-center text-body text-ink-muted">
        {LABELS.pageNotFoundBody}
      </p>
      <Button asChild>
        <Link href={PATHS.home}>{LABELS.goToHomepage}</Link>
      </Button>
    </div>
  );
}
