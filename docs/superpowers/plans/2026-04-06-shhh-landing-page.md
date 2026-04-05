# Shhh Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, Apple-inspired case study landing page for the Shhh macOS dictation tool with 3 interactive Remotion animations showcasing the design process, pill UI states, and user flow.

**Architecture:** Standalone React + Vite app at `Shhh/landing/`. Remotion `<Player>` components embedded inline for interactive animations. Scroll-driven section reveals via Intersection Observer. Tailwind CSS for styling.

**Tech Stack:** React 19, TypeScript, Vite, Remotion (`@remotion/player`), Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-04-06-shhh-landing-page-design.md`

---

## File Structure

```
Shhh/landing/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── AnimationPlayer.tsx
│   │   ├── ScrollReveal.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── Problem.tsx
│   │       ├── DesignExploration.tsx
│   │       ├── ThePill.tsx
│   │       ├── UserFlow.tsx
│   │       ├── CraftDetails.tsx
│   │       └── Footer.tsx
│   ├── remotion/
│   │   ├── DesignIteration.tsx
│   │   ├── PillStates.tsx
│   │   ├── UserFlowDemo.tsx
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
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `landing/package.json`
- Create: `landing/vite.config.ts`
- Create: `landing/tailwind.config.ts`
- Create: `landing/tsconfig.json`
- Create: `landing/index.html`
- Create: `landing/src/main.tsx`
- Create: `landing/src/styles/globals.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "shhh-landing",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "remotion": "^4.0.0",
    "@remotion/player": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

- [ ] **Step 3: Create tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        "accent-start": "#ff6b6b",
        "accent-end": "#ee5a24",
        "pill-bg": "rgba(0,0,0,0.95)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shhh — Case Study</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create globals.css**

```css
@import "tailwindcss";

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0a0a0a;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 7: Create main.tsx**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 8: Install dependencies and verify dev server starts**

```bash
cd landing && npm install && npm run dev
```

Expected: Vite dev server starts on localhost, blank page renders without errors.

- [ ] **Step 9: Commit**

```bash
git add landing/
git commit -m "feat: scaffold landing page project (React + Vite + Tailwind + Remotion)"
```

---

## Task 2: Shared Components — ScrollReveal and AnimationPlayer

**Files:**
- Create: `landing/src/components/ScrollReveal.tsx`
- Create: `landing/src/components/AnimationPlayer.tsx`

- [ ] **Step 1: Create ScrollReveal component**

Uses Intersection Observer to fade/slide children in when they enter the viewport.

```tsx
import { useEffect, useRef, useState, type ReactNode } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create AnimationPlayer wrapper**

Wraps Remotion `<Player>` with autoplay-on-scroll behavior.

```tsx
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, type ComponentType } from "react";

type AnimationPlayerProps = {
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  compositionWidth: number;
  compositionHeight: number;
  fps?: number;
};

export function AnimationPlayer({
  component,
  durationInFrames,
  compositionWidth,
  compositionHeight,
  fps = 30,
}: AnimationPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const player = playerRef.current;
        if (!player) return;
        if (entry.isIntersecting) {
          player.play();
        } else {
          player.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      <Player
        ref={playerRef}
        component={component}
        durationInFrames={durationInFrames}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        fps={fps}
        style={{ width: "100%", borderRadius: "12px" }}
        controls
        loop
        clickToPlay
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify both components compile**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add landing/src/components/
git commit -m "feat: add ScrollReveal and AnimationPlayer shared components"
```

---

## Task 3: Remotion Shared Components — WaveformBars and PulsingDots

**Files:**
- Create: `landing/src/remotion/components/WaveformBars.tsx`
- Create: `landing/src/remotion/components/PulsingDots.tsx`

- [ ] **Step 1: Create WaveformBars component**

9 bars with warm orange-red gradient, staggered sine-wave animation driven by Remotion frame.

```tsx
import { useCurrentFrame } from "remotion";

const BAR_COUNT = 9;
const GRADIENT_START = "#ff6b6b";
const GRADIENT_END = "#ee5a24";

export function WaveformBars({ height = 22 }: { height?: number }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height,
      }}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const phase = (i / BAR_COUNT) * Math.PI * 2;
        const wave = Math.sin(frame * 0.15 + phase);
        const scaleY = 0.3 + 0.7 * ((wave + 1) / 2);

        return (
          <div
            key={i}
            style={{
              width: 3.5,
              height: height * 0.9,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${GRADIENT_START}, ${GRADIENT_END})`,
              transform: `scaleY(${scaleY})`,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create PulsingDots component**

3 dots with staggered opacity pulsing driven by Remotion frame.

```tsx
import { interpolate, useCurrentFrame } from "remotion";

export function PulsingDots() {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
      {[0, 1, 2].map((i) => {
        const cycle = (frame + i * 8) % 36;
        const opacity = interpolate(cycle, [0, 18, 36], [0.3, 1, 0.3]);

        return (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "white",
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add landing/src/remotion/components/WaveformBars.tsx landing/src/remotion/components/PulsingDots.tsx
git commit -m "feat: add WaveformBars and PulsingDots Remotion components"
```

---

## Task 4: Remotion Pill Components (4 design variants)

**Files:**
- Create: `landing/src/remotion/components/pills/FullIsland.tsx`
- Create: `landing/src/remotion/components/pills/SlimDropdown.tsx`
- Create: `landing/src/remotion/components/pills/RedRing.tsx`
- Create: `landing/src/remotion/components/pills/PureMinimal.tsx`

These are static visual representations of each pill design for the DesignIteration animation. Each renders a fixed "recording" state snapshot — no frame-based animation needed (the parent composition handles cross-fades).

- [ ] **Step 1: Create FullIsland pill**

Large blob with red dot, warm waveform bars, timer, transcript inside.

```tsx
export function FullIsland() {
  return (
    <div
      style={{
        width: 260,
        height: 86,
        background: "#000",
        borderRadius: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "12px 20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff453a" }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[5, 10, 16, 20, 16, 10, 5].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: "linear-gradient(180deg, #ff6b6b, #ee5a24)",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6, fontVariantNumeric: "tabular-nums", color: "white" }}>
          0:03
        </span>
      </div>
      <div style={{ fontSize: 12, opacity: 0.45, color: "white", width: "100%", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Hello, I am testing this app...
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SlimDropdown pill**

Compact pill with waveform, plus separate dropdown transcript panel below.

```tsx
export function SlimDropdown() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 180,
          height: 44,
          background: "#000",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff453a" }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[5, 10, 16, 20, 16, 10, 5].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: "linear-gradient(180deg, #ff6b6b, #ee5a24)",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.5, color: "white", fontVariantNumeric: "tabular-nums" }}>
          0:03
        </span>
      </div>
      <div
        style={{
          background: "#000",
          borderRadius: 14,
          padding: "10px 16px",
          fontSize: 12,
          color: "white",
          opacity: 0.4,
          minWidth: 200,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        Hello, I am testing this...
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create RedRing pill**

Like FullIsland but with a pulsing red border and white waveform bars.

```tsx
export function RedRing() {
  return (
    <div
      style={{
        width: 240,
        height: 80,
        background: "#000",
        borderRadius: 26,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "10px 20px",
        boxShadow: "0 0 30px rgba(255,59,48,0.15), 0 4px 20px rgba(0,0,0,0.5)",
        border: "2px solid rgba(255,59,48,0.4)",
      }}
    >
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff453a" }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[5, 10, 16, 20, 16, 10, 5].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: "white",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.5, color: "white", fontVariantNumeric: "tabular-nums" }}>
          0:03
        </span>
      </div>
      <div style={{ fontSize: 12, opacity: 0.4, color: "white", width: "100%", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Hello, I am testing this app...
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create PureMinimal pill**

Just waveform + transcript text, no red dot, no timer. Maximum zen.

```tsx
export function PureMinimal() {
  return (
    <div
      style={{
        width: 220,
        height: 72,
        background: "rgba(0,0,0,0.95)",
        borderRadius: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", gap: 3, alignItems: "center", height: 22 }}>
        {[5, 10, 15, 20, 22, 20, 15, 10, 5].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3.5,
              height: h,
              borderRadius: 2,
              background: "white",
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "white", opacity: 0.5, textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Hello, I am testing this app...
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add landing/src/remotion/components/pills/
git commit -m "feat: add 4 pill design variant components for DesignIteration animation"
```

---

## Task 5: Remotion Composition — DesignIteration

**Files:**
- Create: `landing/src/remotion/DesignIteration.tsx`

- [ ] **Step 1: Create DesignIteration composition**

8 seconds (240 frames at 30fps). Cross-dissolves between 4 pill designs with labels. Final design gets an accent highlight.

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FullIsland } from "./components/pills/FullIsland";
import { SlimDropdown } from "./components/pills/SlimDropdown";
import { RedRing } from "./components/pills/RedRing";
import { PureMinimal } from "./components/pills/PureMinimal";

const DESIGNS = [
  { component: FullIsland, label: "Full Island", desc: "Large blob with red dot, timer, and transcript inside" },
  { component: SlimDropdown, label: "Slim + Dropdown", desc: "Compact pill with separate transcript panel" },
  { component: RedRing, label: "Red Ring", desc: "Pulsing red border, cinematic feel" },
  { component: PureMinimal, label: "Pure Minimal", desc: "Just waveform and text. Maximum zen." },
];

const HOLD_FRAMES = 60; // 2s per design

export function DesignIteration() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TRANSITION = 15;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
      {DESIGNS.map((design, i) => {
        const start = i * HOLD_FRAMES;
        const end = start + HOLD_FRAMES;

        const enterOpacity = interpolate(frame, [start, start + TRANSITION], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const exitOpacity =
          i < DESIGNS.length - 1
            ? interpolate(frame, [end - TRANSITION, end], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        const opacity = Math.min(enterOpacity, exitOpacity);

        const labelSpring = spring({
          fps,
          frame: frame - start - 5,
          config: { damping: 20, stiffness: 100 },
          durationInFrames: 20,
        });

        const isLast = i === DESIGNS.length - 1;
        const Pill = design.component;

        return (
          <AbsoluteFill
            key={i}
            style={{ opacity, justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ position: "relative" }}>
              {isLast && frame > start + 10 && (
                <div
                  style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: 30,
                    border: "1px solid rgba(255,107,107,0.3)",
                    boxShadow: "0 0 20px rgba(255,107,107,0.1)",
                    opacity: interpolate(frame, [start + 10, start + 25], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
              )}
              <Pill />
            </div>
            <div
              style={{
                marginTop: 28,
                textAlign: "center",
                opacity: labelSpring,
                transform: `translateY(${(1 - labelSpring) * 10}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: isLast ? "#ff6b6b" : "white",
                  letterSpacing: 1,
                }}
              >
                {isLast ? "✓ " : ""}
                {design.label}
              </div>
              <div style={{ fontSize: 13, color: "white", opacity: 0.4, marginTop: 4 }}>
                {design.desc}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add landing/src/remotion/DesignIteration.tsx
git commit -m "feat: add DesignIteration Remotion composition (4 pill cross-fades)"
```

---

## Task 6: Remotion Composition — PillStates

**Files:**
- Create: `landing/src/remotion/PillStates.tsx`

- [ ] **Step 1: Create PillStates composition**

6 seconds (180 frames at 30fps). The Pure Minimal pill cycles through: idle → recording → recording with text → processing → done.

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WaveformBars } from "./components/WaveformBars";
import { PulsingDots } from "./components/PulsingDots";

const TRANSCRIPT = "Meeting notes for Monday...";

export function PillStates() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-15: idle (nothing)
  // 15-30: pill springs in
  // 30-90: recording with waveform, "Listening..."
  // 90-120: recording with typed transcript
  // 120-140: processing (dots)
  // 140-165: pill springs out
  // 165-180: idle again

  const enterScale = spring({
    fps,
    frame: frame - 15,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });

  const exitScale = spring({
    fps,
    frame: frame - 140,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 20,
  });

  const pillVisible = frame >= 15 && frame < 165;
  const scale = pillVisible ? enterScale * (1 - exitScale) : 0;

  const isRecording = frame >= 30 && frame < 120;
  const isProcessing = frame >= 120 && frame < 140;

  // Typed transcript
  const typingProgress = interpolate(frame, [90, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(typingProgress * TRANSCRIPT.length);
  const showTranscript = frame >= 90 && frame < 120;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 220,
          height: 72,
          background: "rgba(0,0,0,0.95)",
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "10px 20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
          transform: `scale(${scale})`,
          opacity: scale,
        }}
      >
        {isRecording && <WaveformBars height={22} />}
        {isProcessing && <PulsingDots />}

        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "white",
            opacity: isProcessing ? 0.35 : showTranscript ? 0.5 : 0.35,
            textAlign: "center",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {isProcessing
            ? "Processing..."
            : showTranscript
              ? TRANSCRIPT.slice(0, visibleChars)
              : isRecording
                ? "Listening..."
                : ""}
        </div>
      </div>
    </AbsoluteFill>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add landing/src/remotion/PillStates.tsx
git commit -m "feat: add PillStates Remotion composition (state cycle animation)"
```

---

## Task 7: Remotion Components — MockDesktop, MockEditor, KeystrokeIndicator

**Files:**
- Create: `landing/src/remotion/components/MockDesktop.tsx`
- Create: `landing/src/remotion/components/MockEditor.tsx`
- Create: `landing/src/remotion/components/KeystrokeIndicator.tsx`

- [ ] **Step 1: Create MockDesktop component**

Simulated macOS chrome — menu bar with traffic lights and app name.

```tsx
import type { ReactNode } from "react";

export function MockDesktop({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #2a2a3a 0%, #1e1e2e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Menu bar */}
      <div
        style={{
          height: 26,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          fontSize: 11,
          color: "white",
          opacity: 0.5,
          gap: 16,
        }}
      >
        <span style={{ fontWeight: 700 }}></span>
        <span>Finder</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create MockEditor component**

Simulated text editor window with title bar and text area.

```tsx
import { interpolate, useCurrentFrame } from "remotion";

type MockEditorProps = {
  text: string;
  showTextAfterFrame: number;
};

export function MockEditor({ text, showTextAfterFrame }: MockEditorProps) {
  const frame = useCurrentFrame();

  const typingProgress = interpolate(
    frame,
    [showTextAfterFrame, showTextAfterFrame + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleChars = Math.floor(typingProgress * text.length);
  const showText = frame >= showTextAfterFrame;

  // Cursor blink
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 40,
        right: 40,
        bottom: 40,
        background: "#1a1a1a",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 32,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ fontSize: 11, color: "white", opacity: 0.4, marginLeft: 8 }}>
          Notes — Untitled
        </span>
      </div>
      {/* Text area */}
      <div style={{ padding: 16, fontSize: 14, color: "white", opacity: 0.8, lineHeight: 1.6 }}>
        {showText && text.slice(0, visibleChars)}
        {cursorVisible && (
          <span style={{ borderLeft: "2px solid rgba(255,255,255,0.6)", marginLeft: 1 }}>
            &nbsp;
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create KeystrokeIndicator component**

Subtle keystroke badge that springs in.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type KeystrokeIndicatorProps = {
  showAtFrame: number;
  label?: string;
};

export function KeystrokeIndicator({ showAtFrame, label = "⌘R" }: KeystrokeIndicatorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < showAtFrame) return null;

  const enter = spring({
    fps,
    frame: frame - showAtFrame,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: 15,
  });

  const exit = spring({
    fps,
    frame: frame - showAtFrame - 25,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 15,
  });

  const opacity = enter * (1 - exit);
  if (opacity < 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: `translateX(-50%) scale(${0.8 + 0.2 * enter})`,
        opacity,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 8,
        padding: "6px 14px",
        fontSize: 14,
        fontWeight: 500,
        color: "white",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {label}
    </div>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add landing/src/remotion/components/MockDesktop.tsx landing/src/remotion/components/MockEditor.tsx landing/src/remotion/components/KeystrokeIndicator.tsx
git commit -m "feat: add MockDesktop, MockEditor, KeystrokeIndicator Remotion components"
```

---

## Task 8: Remotion Composition — UserFlowDemo

**Files:**
- Create: `landing/src/remotion/UserFlowDemo.tsx`

- [ ] **Step 1: Create UserFlowDemo composition**

12 seconds (360 frames at 30fps). Full simulated macOS desktop showing the complete dictation flow.

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MockDesktop } from "./components/MockDesktop";
import { MockEditor } from "./components/MockEditor";
import { KeystrokeIndicator } from "./components/KeystrokeIndicator";
import { WaveformBars } from "./components/WaveformBars";
import { PulsingDots } from "./components/PulsingDots";

const INTERIM_TEXT = "Meeting notes for Monday";
const FINAL_TEXT = "Meeting notes for Monday — review Q2 targets and finalize budget.";

export function UserFlowDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-60: desktop idle, cursor blinking
  // 60: first ⌘R keystroke
  // 75-90: pill springs in
  // 90-240: dictation (waveform + typed interim text)
  // 240: second ⌘R keystroke
  // 250-270: processing dots
  // 270-285: pill springs out
  // 285-360: polished text appears in editor

  // Pill visibility
  const pillEnter = spring({
    fps,
    frame: frame - 75,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });
  const pillExit = spring({
    fps,
    frame: frame - 270,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 15,
  });
  const pillVisible = frame >= 75 && frame < 290;
  const pillScale = pillVisible ? pillEnter * (1 - pillExit) : 0;

  const isRecording = frame >= 90 && frame < 240;
  const isProcessing = frame >= 250 && frame < 270;

  // Interim text typing
  const interimProgress = interpolate(frame, [100, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const interimChars = Math.floor(interimProgress * INTERIM_TEXT.length);

  // Pill text
  let pillText = "";
  if (isRecording) {
    pillText = interimProgress > 0 ? INTERIM_TEXT.slice(0, interimChars) : "Listening...";
  } else if (isProcessing) {
    pillText = "Processing...";
  }

  return (
    <AbsoluteFill>
      <MockDesktop>
        <MockEditor text={FINAL_TEXT} showTextAfterFrame={285} />

        {/* Pill overlay — top center */}
        {pillScale > 0 && (
          <div
            style={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: `translateX(-50%) scale(${pillScale})`,
              opacity: pillScale,
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 220,
                height: 72,
                background: "rgba(0,0,0,0.95)",
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
              }}
            >
              {isRecording && <WaveformBars height={22} />}
              {isProcessing && <PulsingDots />}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "white",
                  opacity: isProcessing ? 0.35 : interimProgress > 0 ? 0.5 : 0.35,
                  textAlign: "center",
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {pillText}
              </div>
            </div>
          </div>
        )}

        {/* Keystroke indicators */}
        <KeystrokeIndicator showAtFrame={60} label="⌘R" />
        <KeystrokeIndicator showAtFrame={240} label="⌘R" />
      </MockDesktop>
    </AbsoluteFill>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add landing/src/remotion/UserFlowDemo.tsx
git commit -m "feat: add UserFlowDemo Remotion composition (full dictation flow)"
```

---

## Task 9: Landing Page Sections — Hero, Problem, Footer

**Files:**
- Create: `landing/src/components/sections/Hero.tsx`
- Create: `landing/src/components/sections/Problem.tsx`
- Create: `landing/src/components/sections/Footer.tsx`

- [ ] **Step 1: Create Hero section**

```tsx
export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Idle pill teaser */}
      <div className="w-12 h-2 bg-white/5 rounded-full mb-12" />

      <h1 className="text-6xl font-light tracking-widest text-white/90 lowercase">
        shhh.
      </h1>
      <p className="mt-6 text-lg text-white/40 font-light tracking-wide">
        A macOS dictation tool, designed to disappear.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Create Problem section**

```tsx
import { ScrollReveal } from "../ScrollReveal";

export function Problem() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <ScrollReveal>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-10">
            Why build this?
          </h2>
          <div className="space-y-6 text-base text-white/50 leading-relaxed">
            <p>
              Existing dictation tools are clunky. They pop up modal windows,
              break your flow, and feel like an afterthought bolted onto the OS.
              Voice input should be invisible — as seamless as typing.
            </p>
            <p>
              For bilingual users switching between English and Hebrew,
              it's even worse. Most tools don't handle RTL languages well,
              and none auto-detect which language you're speaking.
            </p>
            <p>
              I wanted something that lives in the background, activates with a
              single key, and gets out of the way the moment you're done.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 3: Create Footer section**

```tsx
const TECH = ["Python", "Swift", "Google Cloud STT", "Gemini", "Remotion"];

export function Footer() {
  return (
    <footer className="py-24 px-6 flex flex-col items-center gap-10">
      <h3 className="text-sm uppercase tracking-widest text-white/30">
        Built with
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {TECH.map((t) => (
          <span
            key={t}
            className="px-4 py-1.5 text-xs text-white/40 border border-white/10 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href="/"
        className="text-sm text-white/30 hover:text-white/60 transition-colors"
      >
        &larr; Back to portfolio
      </a>
    </footer>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add landing/src/components/sections/Hero.tsx landing/src/components/sections/Problem.tsx landing/src/components/sections/Footer.tsx
git commit -m "feat: add Hero, Problem, and Footer sections"
```

---

## Task 10: Landing Page Sections — DesignExploration, ThePill, UserFlow

**Files:**
- Create: `landing/src/components/sections/DesignExploration.tsx`
- Create: `landing/src/components/sections/ThePill.tsx`
- Create: `landing/src/components/sections/UserFlow.tsx`

- [ ] **Step 1: Create DesignExploration section**

```tsx
import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { DesignIteration } from "../../remotion/DesignIteration";

export function DesignExploration() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <ScrollReveal>
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-4 text-center">
            Finding the right UI
          </h2>
          <p className="text-base text-white/40 mb-12 text-center max-w-xl mx-auto">
            Inspired by Apple's Dynamic Island, I explored several approaches
            for a floating dictation indicator — from information-dense to radically minimal.
          </p>

          <AnimationPlayer
            component={DesignIteration}
            durationInFrames={240}
            compositionWidth={1280}
            compositionHeight={720}
          />

          <p className="text-sm text-white/30 mt-8 text-center max-w-lg mx-auto leading-relaxed">
            Pure Minimal won. No timer, no red dot — just waveform and text.
            A dictation tool should tell you it's listening, not demand your attention.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Create ThePill section**

```tsx
import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { PillStates } from "../../remotion/PillStates";

const ANNOTATIONS = [
  { label: "Spring animation", desc: "Organic feel for appear/disappear" },
  { label: "9-bar waveform", desc: "Staggered timing, sine-wave driven" },
  { label: "Warm gradient", desc: "Orange-red, not harsh — inviting, not alarming" },
  { label: "Text inside", desc: "No separate panel — everything in one compact pill" },
];

export function ThePill() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <ScrollReveal>
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-12 text-center">
            Pure Minimal
          </h2>

          <AnimationPlayer
            component={PillStates}
            durationInFrames={180}
            compositionWidth={800}
            compositionHeight={200}
          />

          <div className="grid grid-cols-2 gap-6 mt-12 max-w-xl mx-auto">
            {ANNOTATIONS.map((a) => (
              <div key={a.label}>
                <div className="text-xs uppercase tracking-widest text-accent-start/80 mb-1">
                  {a.label}
                </div>
                <div className="text-sm text-white/40">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 3: Create UserFlow section**

```tsx
import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { UserFlowDemo } from "../../remotion/UserFlowDemo";

const STEPS = [
  { num: "1", label: "Tap hotkey", desc: "Right-Command key" },
  { num: "2", label: "Speak", desc: "English or Hebrew" },
  { num: "3", label: "Text appears", desc: "Polished and pasted" },
];

export function UserFlow() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <ScrollReveal>
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-12 text-center">
            How it works
          </h2>

          <AnimationPlayer
            component={UserFlowDemo}
            durationInFrames={360}
            compositionWidth={1280}
            compositionHeight={800}
          />

          <div className="flex justify-center gap-12 mt-12">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-white/60 mx-auto mb-2">
                  {s.num}
                </div>
                <div className="text-sm font-medium text-white/70">{s.label}</div>
                <div className="text-xs text-white/30 mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add landing/src/components/sections/DesignExploration.tsx landing/src/components/sections/ThePill.tsx landing/src/components/sections/UserFlow.tsx
git commit -m "feat: add DesignExploration, ThePill, and UserFlow sections with Remotion players"
```

---

## Task 11: CraftDetails Section

**Files:**
- Create: `landing/src/components/sections/CraftDetails.tsx`

- [ ] **Step 1: Create CraftDetails section**

Grid of feature cards with staggered fade-in using Intersection Observer.

```tsx
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  { icon: "🌐", title: "Bilingual", desc: "English + Hebrew with auto-detection" },
  { icon: "✨", title: "Grammar polish", desc: "Gemini-powered punctuation and correction" },
  { icon: "⚡", title: "Streaming STT", desc: "Real-time interim results as you speak" },
  { icon: "⌘", title: "Right-Command", desc: "Single key tap — no chord, no UI to find" },
  { icon: "📋", title: "Paste anywhere", desc: "Text appears at your cursor in any app" },
  { icon: "👻", title: "Menu bar only", desc: "No Dock icon, no window, invisible when idle" },
];

export function CraftDetails() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <h2 className="text-3xl font-light tracking-wide text-white/90 mb-14 text-center">
        The details that matter
      </h2>
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease-out ${i * 0.1}s, transform 0.6s ease-out ${i * 0.1}s`,
            }}
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <div className="text-sm font-medium text-white/70 mb-1">{f.title}</div>
            <div className="text-xs text-white/35 leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add landing/src/components/sections/CraftDetails.tsx
git commit -m "feat: add CraftDetails section with staggered card reveal"
```

---

## Task 12: App Root — Assemble All Sections

**Files:**
- Create: `landing/src/App.tsx`

- [ ] **Step 1: Create App.tsx**

```tsx
import { Hero } from "./components/sections/Hero";
import { Problem } from "./components/sections/Problem";
import { DesignExploration } from "./components/sections/DesignExploration";
import { ThePill } from "./components/sections/ThePill";
import { UserFlow } from "./components/sections/UserFlow";
import { CraftDetails } from "./components/sections/CraftDetails";
import { Footer } from "./components/sections/Footer";

export function App() {
  return (
    <main>
      <Hero />
      <Problem />
      <DesignExploration />
      <ThePill />
      <UserFlow />
      <CraftDetails />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the full app compiles and renders**

```bash
cd landing && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Start dev server and visually verify**

```bash
cd landing && npm run dev
```

Expected: Dev server starts. Open in browser — all 7 sections render, Remotion players load and play, scroll reveals work, dark theme applied.

- [ ] **Step 4: Commit**

```bash
git add landing/src/App.tsx
git commit -m "feat: assemble all sections in App root"
```

---

## Task 13: Visual Polish and Final Adjustments

**Files:**
- Modify: `landing/src/styles/globals.css`
- Modify: various section files as needed

- [ ] **Step 1: Add smooth scroll and selection styles to globals.css**

Add to `landing/src/styles/globals.css`:

```css
::selection {
  background: rgba(255, 107, 107, 0.3);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
```

- [ ] **Step 2: Verify everything renders correctly in browser**

```bash
cd landing && npm run dev
```

Walk through all sections in browser:
1. Hero — "shhh." centered, tagline below, idle pill bar visible
2. Problem — text fades in on scroll
3. Design Exploration — Remotion player loads, plays 4-pill cross-fade
4. The Pill — Remotion player loads, pill cycles through states
5. User Flow — Remotion player loads, full desktop demo plays
6. Craft Details — cards fade in staggered
7. Footer — tech badges, back link

- [ ] **Step 3: Run production build**

```bash
cd landing && npm run build
```

Expected: Build succeeds, output in `landing/dist/`.

- [ ] **Step 4: Commit**

```bash
git add landing/
git commit -m "feat: visual polish and verify production build"
```
