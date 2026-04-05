# Shhh Landing Page - Visual Redesign Spec

## Overview

Redesign the existing Shhh landing page from developer-minimal to a Bento Grid / Editorial layout. The Remotion animations and their compositions are unchanged - this is purely a visual/layout redesign of the page sections and CSS.

**Scope:** Modify existing section components + globals.css + AnimationPlayer. No changes to Remotion compositions (DesignIteration, PillStates, UserFlowDemo) or their sub-components.

## Key Changes from Current

1. **Bento grid layouts** - sections use asymmetric card grids instead of centered single-column
2. **Glass-effect cards** - subtle borders, background tints, gradient accents on animation cards
3. **Section labels** - red accent labels ("The Problem", "Design Exploration", etc.) above headings
4. **Gradient dividers** - thin accent-colored lines between sections
5. **Reduced height** - hero is ~60vh not 100vh, sections use `py-20` not `min-h-screen`
6. **Animation cards** - Remotion players sit inside accent-bordered bento cards, centered
7. **Hero polish** - radial glow, animated pill pulse, scroll hint
8. **Text fix** - replace all em dashes with hyphens

## Section-by-Section Changes

### Section 1: Hero
- Reduce height from `min-h-screen` to `h-[60vh]`
- Add radial gradient glow behind the wordmark (subtle warm red, blurred)
- Animate the idle pill teaser with a slow pulse (width + opacity CSS animation)
- Add "Scroll to explore" hint at bottom
- Keep existing content (wordmark + tagline)

### Section 2: Problem
- Remove `min-h-screen`, use `py-20`
- Add section label: "The Problem" in accent red
- Replace paragraphs with a bento grid:
  - Row 1: large text card (2-col span) + stat card ("2 Languages")
  - Row 2: text card + accent-bordered card (2-col span) with the "single key" quote
- Cards: `bg-white/[0.025]`, `border border-white/[0.06]`, `rounded-2xl`

### Section 3: Design Exploration
- Remove `min-h-screen`, use `py-20`
- Add section label: "Design Exploration"
- Bento grid: 2-column asymmetric
  - Left column: intro text card (top) + conclusion text card (bottom)
  - Right column: animation hero card spanning 2 rows, with accent border + radial glow
- AnimationPlayer centered within the hero card

### Section 4: The Pill
- Remove `min-h-screen`, use `py-20`
- Add section label: "The Solution"
- Bento grid:
  - Row 1: full-width animation hero card with accent border
  - Row 2: 4 annotation cards in a row (Spring, Waveform, Gradient, All-in-one)
- Annotation cards have accent-red label + description

### Section 5: User Flow
- Remove `min-h-screen`, use `py-20`
- Add section label: "User Flow"
- Full-width animation hero card with accent border
- Below: 3 step cards in a row with numbered accent badges (red ring with number)

### Section 6: Craft Details
- Remove `min-h-screen`, use `py-20`
- Add section label: "Craft"
- 3x2 grid of cards with icon containers (rounded square bg) instead of bare emojis
- Slightly more visible card backgrounds

### Section 7: Footer
- Add top border divider
- Keep existing content, unchanged

### Between Sections
- Thin gradient divider: 40px wide, accent color, centered

## AnimationPlayer Changes

- Ensure the player is centered (flex centering) within its parent card
- The player should fill the card width with proper padding
- No layout changes to the Player props themselves

## globals.css Additions

```css
/* Gradient divider */
.divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,107,107,0.3), transparent);
  margin: 0 auto;
}
```

## Text Content Changes

Replace all `—` (em dash) with `-` (hyphen) across all section components.

Affected files (all `—` to `-`):
- `Problem.tsx`: "invisible — as seamless"
- `DesignExploration.tsx`: "indicator — from information-dense", "red dot — just waveform"
- `ThePill.tsx`: "not harsh — inviting", "panel — everything"
- `CraftDetails.tsx`: "tap — no chord"
- `UserFlowDemo.tsx`: FINAL_TEXT constant "Monday — review"
- `MockEditor.tsx`: "Notes — Untitled"

## Files to Modify

- `src/styles/globals.css` - add divider class, hero glow keyframes
- `src/components/sections/Hero.tsx` - reduce height, add glow/pulse/scroll hint
- `src/components/sections/Problem.tsx` - bento grid layout
- `src/components/sections/DesignExploration.tsx` - bento grid with hero animation card
- `src/components/sections/ThePill.tsx` - bento grid with annotation cards
- `src/components/sections/UserFlow.tsx` - hero card + step cards
- `src/components/sections/CraftDetails.tsx` - icon containers, card visibility
- `src/components/sections/Footer.tsx` - top border
- `src/components/AnimationPlayer.tsx` - centering within parent
- `src/App.tsx` - add dividers between sections
- `src/remotion/UserFlowDemo.tsx` - em dash fix in FINAL_TEXT constant
- `src/remotion/components/MockEditor.tsx` - em dash fix in title text
- `src/components/sections/CraftDetails.tsx` - em dash fix + icon containers

## Out of Scope

- No changes to Remotion compositions or their animation logic
- No changes to ScrollReveal component
- No new dependencies
- No structural changes to project
