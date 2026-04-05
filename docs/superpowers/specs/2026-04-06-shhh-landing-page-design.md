# Shhh Landing Page — Case Study Design Spec

## Overview

A design-focused case study landing page for the Shhh macOS dictation tool. Tells the story of how the app was designed — from problem to exploration to final solution — using interactive Remotion animations as the centerpiece. Dark, moody, Apple-product-page aesthetic.

**Type:** Standalone React app (linked from `ran-portfolio`)
**Audience:** Designers and design managers
**Visual style:** Dark (#0a0a0a), minimal, warm orange-red accents from waveform

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Remotion** — `@remotion/player` for inline interactive animations
- **Tailwind CSS** — styling
- Deployed as a static site (Vercel/Netlify/GitHub Pages)
- Lives as a new project directory: `Shhh/landing/` inside the Shhh project

## Page Structure — 7 Scroll Sections

### Section 1: Hero
- Large "shhh." wordmark, centered
- One-liner tagline: *"A macOS dictation tool, designed to disappear."*
- Subtle animated pill in idle state (small dark bar, barely visible — a teaser)
- Full viewport, vertically centered

### Section 2: The Problem
- Heading: *"Why build this?"*
- 2-3 short paragraphs about the pain points:
  - Existing dictation tools are clunky, modal, break flow
  - Bilingual users (Hebrew/English) have no good options
  - Voice should feel as natural as typing
- Text-only section, minimal. Fade-in on scroll.

### Section 3: Design Exploration
- Heading: *"Finding the right UI"*
- Brief intro text about exploring multiple approaches inspired by Apple's Dynamic Island
- **Remotion `<Player>`: DesignIteration composition**
  - ~8 seconds, loops
  - Cross-dissolves between 4 pill designs: Full Island → Slim + Dropdown → Red Ring → Pure Minimal
  - Each design holds for ~2s with a label and one-line description fading in below
  - Final design (Pure Minimal) gets a subtle orange-red highlight/checkmark
  - 1280×720, 30fps
- Below the player: short annotation on why Pure Minimal won (zen, non-intrusive, just enough info)

### Section 4: The Pill — Pure Minimal
- Heading: *"Pure Minimal"*
- **Remotion `<Player>`: PillStates composition**
  - ~6 seconds, loops
  - Shows the final pill cycling through all states:
    1. Hidden (idle) — empty
    2. Recording — pill springs in (scale + opacity), waveform bars animate with warm orange-red gradient, "Listening..." text
    3. Recording with text — interim transcript types in: *"Meeting notes for Monday..."*
    4. Processing — waveform stops, 3 pulsing dots replace it, "Processing..." label
    5. Done — pill springs out (scale down + fade)
  - 800×200, 30fps, dark canvas, just the pill centered
- Annotations around the player highlighting design decisions:
  - Spring animation for organic feel
  - 9-bar waveform with staggered timing
  - Warm gradient (not harsh red)
  - Text inside the pill, not separate

### Section 5: User Flow — How It Works
- Heading: *"How it works"*
- **Remotion `<Player>`: UserFlowDemo composition**
  - ~12 seconds, loops
  - Simulated macOS desktop:
    1. (0:00–0:02) Text editor window open, cursor blinking
    2. (0:02–0:03) "⌘R" keystroke indicator appears. Pill springs in from top-center
    3. (0:03–0:08) Waveform animates. Interim text types character-by-character inside pill, refining as "recognition" improves
    4. (0:08–0:09) Second ⌘R tap. Pill transitions to processing dots
    5. (0:09–0:12) Pill disappears. Polished text appears in the editor: *"Meeting notes for Monday — review Q2 targets and finalize budget."*
  - 1280×800, 30fps
- Below: numbered step labels (1. Tap hotkey → 2. Speak → 3. Text appears) as a simple summary

### Section 6: Craft Details
- Heading: *"The details that matter"*
- Grid of 4-6 small cards, each with an icon and short description:
  - **Bilingual** — English + Hebrew with auto-detection
  - **Grammar polish** — Gemini-powered punctuation and correction on stop
  - **Streaming STT** — Google Cloud Speech-to-Text, real-time interim results
  - **Right-Command hotkey** — single-key tap, no chord, no UI to find
  - **Paste anywhere** — text appears at your cursor in any app
  - **Menu bar only** — no Dock icon, no window, invisible when idle
- Cards fade in staggered on scroll

### Section 7: Footer
- "Built with" section: Python, Swift, Google Cloud STT, Gemini, Remotion
- Tech stack as small monochrome badges/pills
- Link back to portfolio: "← Back to portfolio" (links to `ran-portfolio` site)
- Optional: GitHub link to the Shhh repo

## Remotion Compositions — Technical Details

### Shared
- All compositions use `@remotion/player` `<Player>` component embedded inline
- Autoplay when scrolled into view (Intersection Observer)
- Loop enabled on all
- Player controls: play/pause, scrub timeline
- Dark background matches page (#0a0a0a)

### DesignIteration
- **Duration:** 240 frames (8s at 30fps)
- **Resolution:** 1280×720
- **Technique:** Each pill design is a React component. Use `interpolate()` for opacity cross-fade between designs. Labels use `spring()` for enter/exit.
- **Assets needed:** 4 pill components recreated in CSS (ported from the existing `pill-design-v2.html` mockups)
- **Final frame:** Pure Minimal pill with a subtle glow/highlight

### PillStates
- **Duration:** 180 frames (6s at 30fps)
- **Resolution:** 800×200
- **Technique:** `spring()` for pill scale-in/out. Waveform bars: 9 individual `<div>`s with `interpolate()` driving scaleY using noise/sine functions for organic movement. Processing dots: opacity with staggered delay.
- **Assets needed:** Pill component, WaveformBars component, PulsingDots component

### UserFlowDemo
- **Duration:** 360 frames (12s at 30fps)
- **Resolution:** 1280×800
- **Technique:** Simulated macOS chrome (menu bar, window frame) as static components. Pill lifecycle reuses PillStates components. Text typing uses `interpolate()` on string slice. Keystroke indicator uses `spring()` + `opacity`.
- **Assets needed:** MockDesktop component (menu bar + window), MockEditor component (simple text area), KeystrokeIndicator component, pill components from PillStates

## Scroll Behavior

- Each section is full-viewport height (`min-h-screen`)
- Content fades/slides in on scroll (CSS `scroll-snap` optional, or simple Intersection Observer)
- Remotion players autoplay when >50% visible, pause when scrolled away
- Smooth, not jarring — ease-out transitions

## Typography

- System font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`
- Headings: thin weight (300), generous letter-spacing
- Body: regular weight (400), 0.5-0.6 opacity for secondary text
- Accent color: warm orange-red gradient (`#ff6b6b` → `#ee5a24`) — used sparingly

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0a0a0a` | Page background |
| `surface` | `#111111` | Card/section backgrounds |
| `text-primary` | `#ffffff` at 0.9 opacity | Headings |
| `text-secondary` | `#ffffff` at 0.5 opacity | Body text |
| `text-muted` | `#ffffff` at 0.3 opacity | Labels, timestamps |
| `accent-start` | `#ff6b6b` | Gradient start (waveform, highlights) |
| `accent-end` | `#ee5a24` | Gradient end |
| `pill-bg` | `#000000` at 0.95 | Pill background |

## Project Structure

```
Shhh/landing/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root layout, scroll sections
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Problem.tsx
│   │   │   ├── DesignExploration.tsx
│   │   │   ├── ThePill.tsx
│   │   │   ├── UserFlow.tsx
│   │   │   ├── CraftDetails.tsx
│   │   │   └── Footer.tsx
│   │   ├── AnimationPlayer.tsx     # Wrapper: <Player> + autoplay on scroll
│   │   └── ui/                     # Shared small components
│   ├── remotion/
│   │   ├── Root.tsx                # Remotion root (for dev preview)
│   │   ├── DesignIteration.tsx     # Composition: 4 pill morphs
│   │   ├── PillStates.tsx          # Composition: state cycle
│   │   ├── UserFlowDemo.tsx        # Composition: full screen demo
│   │   └── components/
│   │       ├── pills/
│   │       │   ├── FullIsland.tsx
│   │       │   ├── SlimDropdown.tsx
│   │       │   ├── RedRing.tsx
│   │       │   └── PureMinimal.tsx
│   │       ├── WaveformBars.tsx
│   │       ├── PulsingDots.tsx
│   │       ├── MockDesktop.tsx
│   │       ├── MockEditor.tsx
│   │       └── KeystrokeIndicator.tsx
│   └── styles/
│       └── globals.css
├── public/
│   └── (static assets if needed)
└── index.html
```

## Out of Scope

- No download/install functionality — this is a case study, not a product page
- No backend or API — fully static
- No CMS — content is hardcoded
- No responsive mobile optimization in v1 (desktop-first, as the app itself is macOS-only)
- No video export from Remotion — animations are player-only (interactive)
