/** Read live theme tokens so Razorpay matches Ink & Brass at checkout time. */
export function getRazorpayCheckoutTheme(): {
  color: string;
  backdrop_color: string;
} {
  if (typeof document === "undefined") {
    return { color: "#8a6a2e", backdrop_color: "#1b1917" };
  }

  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue("--brand").trim() || "#8a6a2e";
  const backdrop_color =
    style.getPropertyValue("--ink").trim() || "#1b1917";

  return { color, backdrop_color };
}
