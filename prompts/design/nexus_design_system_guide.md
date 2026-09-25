# Nexus Design System

## 1. Vision & Identity

Nexus is a premium social ecosystem defined by **Digital Depth**. The aesthetic combines "Obsidian Dark" surfaces with high-fidelity glassmorphism, vibrant neon accents, and a focus on immersive, layered interfaces.

---

## 2. Visual Language

### 2.1 Color Palette

The color system is optimized for high-contrast legibility on deep, low-light surfaces.

| Category       | Token              | Value                      | Description                                    |
| :------------- | :----------------- | :------------------------- | :--------------------------------------------- |
| **Brand**      | Primary            | `#0066FF`                  | Neon Blue: Primary actions and brand identity. |
|                | Secondary          | `#9D00FF`                  | Violet: Used for gradients and accents.        |
| **Surface**    | Surface            | `#111317`                  | Obsidian: Base background color.               |
|                | Surface Bright     | `#37393e`                  | Higher elevation/glass surfaces.               |
|                | Container          | `#1e2024`                  | Default card and container background.         |
| **Typography** | On Surface         | `#FFFFFF`                  | Primary text and headings.                     |
|                | On Surface Variant | `#A0A0A0`                  | Secondary text and captions.                   |
| **Utility**    | Error              | `#FF4D4D`                  | Destructive actions and alerts.                |
|                | Border             | `rgba(255, 255, 255, 0.1)` | Subtle dividers and glass edges.               |

### 2.2 Typography

**Primary Typeface:** Inter (Sans-serif)

- **Scale:** Modular scale based on 8px.
- **Display:** 48px/56px Bold (Desktop Landing)
- **Headline Large:** 32px/40px Bold
- **Headline Medium:** 24px/32px Semi-Bold
- **Body Large:** 16px/24px Regular
- **Body Medium:** 14px/20px Regular
- **Label Small:** 11px/16px Medium (Uppercase)

### 2.3 Layering & Depth (Glassmorphism)

The signature effect of Nexus is layered translucency.

- **Background Blur:** 12px - 24px (standard for containers).
- **Opacity:** 60% - 80% on surfaces.
- **Border:** 1px solid with 10% white opacity for "rim lighting" effects.
- **Shadow:** Deep, soft shadows (`0 20px 40px rgba(0,0,0,0.4)`) to separate layers.

### 2.4 Spacing & Geometry

- **Grid:** 8pt Grid System.
- **Corner Radius:** 8px (ROUND_EIGHT) for consistency.
- **Margins:**
  - Mobile: 16px / 20px
  - Desktop: 24px / 48px

---

## 3. Component Library

### 3.1 Navigation

- **Desktop Sidebar:** Persistent left-aligned menu with brand wordmark.
- **Mobile Bottom Bar:** 5-item navigation with a centered prominent "Create" action.
- **Navigation Drawer:** Profile-focused mobile sidebar for secondary links (Communities, Bookmarks, Settings).

### 3.2 Post Architecture

- **Feed Card:** Multi-media container with 8px radius, integrated action bar (Like, Comment, Share), and glassmorphic overlays for media metadata.
- **Reels Player:** Full-screen vertical player with right-aligned interaction icons and bottom-aligned creator info.

### 3.3 Buttons & Inputs

- **Primary Button:** Gradient background (Blue to Violet), 8px radius, white text.
- **Ghost Button:** Outline only, used for secondary or destructive actions.
- **Form Inputs:** Darker surface variant background with consistent 8px radius and subtle focus rings.

### 3.4 Feedback & States

- **Skeleton Loaders:** Subtle pulsing obsidian-bright gradients.
- **Verification Badge:** Blue checkmark with a slight outer glow.
- **Active Status:** Neon green dot with a pulsing animation.

---

## 4. Platform Strategies

### 4.1 Desktop: Multi-Column Flow

- **Left:** Navigation & Brand.
- **Center:** Dynamic content (Feed, Chat, Profile).
- **Right:** Contextual widgets (Trending, Suggested Users, Mod Tools).

### 4.2 Mobile: Immersive First

- **Immersive Viewers:** Stories and Reels take over 100% of the viewport.
- **Contextual Navigation:** Bottom sheets for complex actions; back arrows for drill-down views.

---

## 5. Design Principles

1. **Depth over Flatness:** Use blurs and gradients to create a sense of three-dimensional space.
2. **Neon as Signal:** Color should be used sparingly but vibrantly to guide user attention.
3. **Immersive Focus:** Content, especially media, should feel unencumbered by heavy UI chrome.
4. **Consistency is Trust:** Maintain the 8px rhythm and obsidian-dark palette across every screen.
