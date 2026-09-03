import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";

export function FailedAttemptSection({
  value,
  onChange,
  onSubmit,
  pending,
  placeholder,
  submitLabel,
  bordered,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  pending?: boolean;
  placeholder: string;
  submitLabel: string;
  bordered?: boolean;
}) {
  return (
    <section
      className={bordered ? "space-y-3 border-t border-line pt-5" : "space-y-3"}
    >
      <Textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        className="w-full"
        variant="outline"
        disabled={value.trim().length < 3}
        loading={pending}
        onClick={onSubmit}
      >
        {submitLabel}
      </Button>
    </section>
  );
}
