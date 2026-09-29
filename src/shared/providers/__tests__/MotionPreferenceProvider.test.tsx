import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it } from "vitest";
import { MotionConfigContext } from "motion/react";
import { MotionPreferenceProvider } from "../MotionPreferenceProvider";

/** Reports the reduce-motion setting the animation tree will actually see. */
function Probe() {
  const config = useContext(MotionConfigContext);
  return <span data-testid="setting">{config.reducedMotion ?? "unset"}</span>;
}

/**
 * framer-motion asks the OS per component via `useReducedMotion`, and only two
 * of the ~24 animating files remember to. The provider is what makes the other
 * twenty-two obey the setting, so its value is asserted rather than assumed.
 */
describe("MotionPreferenceProvider", () => {
  it("tells every motion component to follow the user's OS setting", () => {
    render(
      <MotionPreferenceProvider>
        <Probe />
      </MotionPreferenceProvider>,
    );

    expect(screen.getByTestId("setting")).toHaveTextContent("user");
  });
});
