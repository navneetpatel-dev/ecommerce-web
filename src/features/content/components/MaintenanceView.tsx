import { LABELS } from "@/shared/constants/labels";

export function MaintenanceView() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="max-w-md space-y-4">
        <h1
          className="font-display text-ink"
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {LABELS.maintenanceHeading}
        </h1>
        <p className="text-[0.9375rem] text-ink-muted">
          {LABELS.maintenanceBody}
        </p>
      </div>
    </div>
  );
}
