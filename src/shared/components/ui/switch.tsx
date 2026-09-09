"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/shared/utils/dom/cn";
import { switchStyles } from "../../styles/ui/switch.styles";

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(switchStyles.root, className)}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={switchStyles.thumb}
      style={{ transitionDuration: "var(--motion-fast)" }}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export { Switch };
