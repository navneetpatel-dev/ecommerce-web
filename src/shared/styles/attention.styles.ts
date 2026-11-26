/**
 * Attention effects per button (see `.attention-pulse` and its modifiers in globals.css). Each button
 * gets its own tone, icon movement and rhythm so they read as different cues, not one effect repeated;
 * the `Row` variants only move the icon, so a table full of them stays calm.
 */
export const attentionStyles = {
  /** Eye blinks. */
  preview: "attention-pulse attention-blink",
  previewRow: "attention-pulse attention-quiet attention-blink",
  /** Info-coloured link whose arrow nudges out. */
  manageTax:
    "attention-pulse attention-tone-info attention-no-sheen attention-nudge",
  /** Plus spins and pops, slow rhythm. */
  setOwnRate: "attention-pulse attention-pop attention-cycle-slow",
  /** Success-coloured; the paper plane takes off. */
  submit:
    "attention-pulse attention-tone-success attention-fly attention-cycle-fast",
  submitRow:
    "attention-pulse attention-quiet attention-fly attention-cycle-fast",
  /** Boxes bob. */
  variantsRow: "attention-pulse attention-quiet attention-bob",
  /** Images wiggle. */
  imagesRow:
    "attention-pulse attention-quiet attention-wiggle attention-cycle-slow",
  /** Warning-coloured; the envelope shakes. */
  verifyEmail:
    "attention-pulse attention-tone-warning attention-no-sheen attention-shake",
} as const;
