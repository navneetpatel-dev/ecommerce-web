---
name: Nexus
colors:
  surface: "#111317"
  surface-dim: "#111317"
  surface-bright: "#37393e"
  surface-container-lowest: "#0c0e12"
  surface-container-low: "#1a1c20"
  surface-container: "#1e2024"
  surface-container-high: "#282a2e"
  surface-container-highest: "#333539"
  on-surface: "#e2e2e8"
  on-surface-variant: "#c2c6d8"
  inverse-surface: "#e2e2e8"
  inverse-on-surface: "#2f3035"
  outline: "#8c90a1"
  outline-variant: "#424656"
  surface-tint: "#b3c5ff"
  primary: "#b3c5ff"
  on-primary: "#002b75"
  primary-container: "#0066ff"
  on-primary-container: "#f8f7ff"
  inverse-primary: "#0054d6"
  secondary: "#d0bcff"
  on-secondary: "#3c0091"
  secondary-container: "#571bc1"
  on-secondary-container: "#c4abff"
  tertiary: "#ffb59d"
  on-tertiary: "#5d1900"
  tertiary-container: "#cc4204"
  on-tertiary-container: "#fff6f4"
  error: "#EF4444"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#dae1ff"
  primary-fixed-dim: "#b3c5ff"
  on-primary-fixed: "#001849"
  on-primary-fixed-variant: "#003fa4"
  secondary-fixed: "#e9ddff"
  secondary-fixed-dim: "#d0bcff"
  on-secondary-fixed: "#23005c"
  on-secondary-fixed-variant: "#5516be"
  tertiary-fixed: "#ffdbd0"
  tertiary-fixed-dim: "#ffb59d"
  on-tertiary-fixed: "#390c00"
  on-tertiary-fixed-variant: "#832600"
  background: "#111317"
  on-background: "#e2e2e8"
  surface-variant: "#333539"
  obsidian-dark: "#020203"
  obsidian-surface: rgba(255, 255, 255, 0.03)
  obsidian-border: rgba(255, 255, 255, 0.08)
  glass-accent: rgba(139, 92, 246, 0.15)
  success: "#10B981"
  warning: "#F59E0B"
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter-desktop: 24px
  margin-desktop: 48px
  gutter-mobile: 16px
  margin-mobile: 16px
  max-width-content: 680px
---

## Brand & Style

The design system is built upon a **Modern Premium** philosophy, targeting a digitally native audience that values both aesthetic sophistication and high-speed functional clarity. The brand personality is "The Refined Connector"—an interface that feels like a high-end physical object while maintaining the fluidity of a digital social space.

### Design Movement: Glassmorphic Minimalism

The visual language leverages **Glassmorphism** to create depth and hierarchy without clutter. Surfaces use blurred backdrops and subtle internal glows to simulate layered obsidian glass. This is paired with **Minimalist** layout principles—generous whitespace, a strict grid, and a focus on high-quality typography—to ensure the interface remains "clean" despite the rich visual effects.

### Emotional Response

- **Focus:** Reducing cognitive load during high-density social consumption.
- **Trust:** Precision-engineered components and consistent spacing evoke a professional, startup-ready feel.
- **Vibrancy:** The energetic primary blue and violet accents inject a "social" pulse into an otherwise monochromatic environment.

## Colors

The design system defaults to a **Dark Mode** first approach, utilizing "Deep Obsidian" values for true depth.

### Palette Strategy

- **Primary (#0066FF):** Reserved for high-intent actions, "Create" triggers, and active navigation states.
- **Secondary (#8B5CF6):** Used for social "energy" points—story rings, premium badges, and interactive gradients.
- **Neutral:** A scale of cool-toned grays starting from #020203 (Base) to #F8FAFC (Text).
- **Glassmorphism:** Surface containers do not use solid hex codes; they use rgba values with a `20px` backdrop blur to allow content to bleed through subtly, maintaining a sense of place within the scroll.

## Typography

This design system uses **Inter** exclusively to achieve a systematic, utilitarian aesthetic that stays out of the way of user-generated content.

### Hierarchy Rules

- **High Readability:** Body text is never smaller than 14px for main feed content to ensure accessibility.
- **Weight as Contrast:** Use `700` weight for headlines and `600` for usernames to create immediate focal points.
- **Letter Spacing:** Headlines use slight negative tracking (`-0.01em` to `-0.02em`) to feel tighter and more "premium," while labels use positive tracking (`0.05em`) for legibility in small caps.

## Layout & Spacing

The layout is built on a **12-column fluid grid** for desktop, but centers around a **fixed-width content column** (680px) for the feed to maintain focus.

### Multi-Column Pattern (Desktop)

- **Left Column (25%):** Fixed navigation with icon + text labels.
- **Center Column (50%):** Fluid content feed, maximum 680px.
- **Right Column (25%):** Contextual discovery, trending, and "Who to Follow."

### Mobile Pattern

The system shifts to a **Bottom Navigation** model. The "Create" action is centered and visually distinct (elevated). Margins are reduced to 16px to maximize media real estate.

- **Breakpoints:** Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px).

## Elevation & Depth

In this design system, depth is communicated through **translucency and refraction** rather than traditional dropshadows.

1.  **Level 0 (Base):** Deep Obsidian (#020203). No transparency.
2.  **Level 1 (Feed Cards):** Obsidian Surface (`rgba(255,255,255,0.03)`) with a `24px` backdrop blur. A `1px` border (`rgba(255,255,255,0.08)`) defines the edge.
3.  **Level 2 (Modals/Overlays):** Darker semi-transparency (`rgba(0,0,0,0.6)`) to push background content further back.
4.  **The "Glow" (Active State):** High-priority items (like a "new post" indicator) use a soft, tinted outer glow using the Primary Blue at 20% opacity.

## Shapes

The shape language is **"Modern Rounded."**

- **Cards & Containers:** Use `1rem` (16px) corners to feel approachable.
- **Avatars:** Strictly circular (100% radius). Premium avatars include a `2px` offset secondary-to-primary gradient ring to indicate active stories.
- **Buttons:** Small buttons use `0.5rem`, while main Action/Create buttons use a full **Pill-shape** to stand out from the rectangular card grid.
- **Inputs:** Soft `0.75rem` rounding to differentiate them from static cards.

## Components

### Create Button (The "Pulse")

The primary Create button is a pill-shaped component with a linear gradient from Primary Blue (#0066FF) to Secondary Violet (#8B5CF6). On hover, it should have a subtle 4px blur glow.

### Feed Cards

- **Construction:** Glassmorphic background, 16px padding.
- **Interaction:** Hovering over a card increases the border opacity from 0.08 to 0.15.
- **Media:** Images and videos should always fill the card width with `0px` top/side margins if they are the primary content.

### Premium Avatars

- **Story Ring:** A `2px` stroke with a conic gradient of the secondary color.
- **Spacing:** Always include a `2px` dark "gap" between the image and the story ring.

### Navigation

- **Desktop Sidebar:** Active links use the Primary color for the icon and a bold weight for text.
- **Mobile Bottom Nav:** Minimalist icons. The center "Create" button is elevated slightly above the bar's top edge.

### Inputs & Fields

- **Search:** Background is `rgba(255,255,255,0.05)`, borderless until focused. On focus, a `1px` Primary Blue border appears.
