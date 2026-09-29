import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { escapeJsonForScript, JsonLd } from "../JsonLd";

/**
 * Structured data embeds product, vendor and help-article copy into a
 * `<script>` block. The HTML parser ends that block at the first `</script`,
 * no matter which JSON string it sits inside.
 */
describe("JsonLd", () => {
  it("cannot be closed early by a name that contains a closing script tag", () => {
    const hostile = { name: '</script><img src=x onerror="alert(1)">' };

    const html = escapeJsonForScript(JSON.stringify(hostile));

    expect(html).not.toContain("</script");
    expect(html).not.toContain("<img");
    // Still the same payload once a consumer parses it back.
    expect(JSON.parse(html)).toEqual(hostile);
  });

  it("escapes the ampersand and the opening bracket too", () => {
    const escaped = escapeJsonForScript(
      JSON.stringify({ name: "Ben & Jerry's <Lamp>" }),
    );

    expect(escaped).not.toContain("&");
    expect(escaped).not.toContain("<");
    expect(JSON.parse(escaped)).toEqual({ name: "Ben & Jerry's <Lamp>" });
  });

  it("renders an ld+json script holding the escaped payload", () => {
    const { container } = render(<JsonLd data={{ name: "</script>" }} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.innerHTML).not.toContain("</script");
    expect(JSON.parse(script!.innerHTML)).toEqual({ name: "</script>" });
  });
});
