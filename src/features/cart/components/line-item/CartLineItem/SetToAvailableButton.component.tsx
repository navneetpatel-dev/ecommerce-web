import { Button } from "@/shared/components/ui/button";

interface SetToAvailableButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/** Lowers a cart line to the stock that is left (shown when stock fell below it). */
export function SetToAvailableButton({
  label,
  onClick,
  disabled = false,
  className,
}: SetToAvailableButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label}
    </Button>
  );
}
