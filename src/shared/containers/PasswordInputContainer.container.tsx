"use client";

import * as React from "react";
import { usePasswordVisibility } from "@/shared/hooks/usePasswordVisibility.hook";
import {
  PasswordInput,
  type PasswordInputProps,
} from "@/shared/components/ui/input";

type PasswordInputContainerProps = Omit<
  PasswordInputProps,
  "visible" | "inputType" | "showLabel" | "onVisibilityToggle"
>;

export const PasswordInputContainer = React.forwardRef<
  HTMLInputElement,
  PasswordInputContainerProps
>((props, ref) => {
  const visibility = usePasswordVisibility();

  return (
    <PasswordInput
      ref={ref}
      visible={visibility.visible}
      inputType={visibility.inputType}
      showLabel={visibility.showLabel}
      onVisibilityToggle={visibility.toggle}
      {...props}
    />
  );
});
PasswordInputContainer.displayName = "PasswordInputContainer";
