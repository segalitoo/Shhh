# Shhh Pill UI Design

**Date:** 2026-02-26
**Status:** Approved

## Overview

Replace the current two-window UI (circular toggle button + separate text preview panel) with a single unified "pill" element at the top-center of the screen, positioned directly under the MacBook notch. The pill transforms through four states with smooth animations, providing a professional, minimal dictation interface.

## Architecture

**Single NSPanel approach.** One oversized transparent NSPanel (400x200) at top-center. SwiftUI content animates between states inside it. Only visible content renders — the rest is transparent.

This replaces the current two-panel system (toggle button panel + preview panel).

## Visual States

### 1. IDLE — Nearly invisible bar

- **Size:** 40px wide x 4px tall
- **Shape:** Fully rounded pill (capsule)
- **Color:** black @ 50% opacity
- **Position:** Centered horizontally, ~8px below top of screen (under notch)
- **Behavior:** Static, no animation

### 2. HOVER — Expanded text pill

- **Size:** ~90x32px (spring animation from idle)
- **Shape:** Rounded pill (capsule)
- **Color:** black @ 80% opacity with backdrop blur (NSVisualEffectView material)
- **Content:** "Shhh" text in white, clean sans-serif font (system medium ~14pt)
- **Animation:** Spring(response: 0.3) for size change, text fades in with opacity 0→1
- **Behavior:** Click starts recording

### 3. RECORDING — Waveform pill + text dropdown

**Pill (top):**
- **Size:** ~140x36px
- **Shape:** Rounded pill (capsule)
- **Color:** black @ 85% opacity + subtle red glow on edges (shadow with red tint)
- **Content:** 7 animated vertical waveform bars
  - Each bar: 2px wide, rounded caps, white
  - 4px gap between bars
  - Height oscillates between 4px (min) and 16px (max)
  - Staggered sine-wave timing per bar for organic feel
  - Continuous animation while recording

**Dropdown (below pill):**
- **Size:** ~320px wide x auto height (up to ~80px)
- **Shape:** Rounded rectangle, 12px corner radius
- **Color:** black @ 85% opacity with backdrop blur
- **Content:** Live transcript text
  - Shows "Listening..." initially (white @ 50% opacity)
  - Shows interim/final text as it arrives (white @ 100%)
  - Font: system 14pt medium, leading alignment
  - Max 3 lines
- **Connection:** Visually connected to pill (2px gap or seamless)
- **Animation:** Slides down from pill with spring animation

**Behavior:** Click stops recording

### 4. PROCESSING — Pulsing dots + final text

**Pill (top):**
- **Size:** Same as recording (~140x36px)
- **Color:** Same dark glass
- **Content:** 3 pulsing dots (white circles, staggered opacity animation)

**Dropdown (below):**
- Shows final/corrected text
- After 3 seconds, entire UI collapses back to idle state

## Transitions

| From | To | Animation |
|------|-----|-----------|
| Idle | Hover | Spring(response: 0.3), bar expands to pill, "Shhh" fades in |
| Hover | Idle | Same spring, collapse back, text fades out |
| Hover | Recording | Pill widens, "Shhh" → waveform crossfade, dropdown slides down |
| Recording | Processing | Waveform → pulsing dots crossfade |
| Processing | Idle | Dropdown slides up, pill collapses to bar, ease-out 0.5s |

## Hover Detection

NSPanel uses a tracking area (NSTrackingArea) to detect mouse enter/exit events. The SwiftUI view receives hover state via `onHover` modifier or a custom NSView tracking area on the panel.

## File Changes

### New Files
- `ShhhApp/Sources/ShhhApp/Views/ShhhPillView.swift` — Unified pill view with all four states
- `ShhhApp/Sources/ShhhApp/Views/WaveformView.swift` — Animated waveform bars component

### Modified Files
- `ShhhApp/Sources/ShhhApp/FloatingWindowManager.swift` — Single panel at top-center, remove toggle/preview panels

### Deleted Files
- `ShhhApp/Sources/ShhhApp/Views/ToggleButtonView.swift` — Replaced by ShhhPillView
- `ShhhApp/Sources/ShhhApp/Views/PreviewPanelView.swift` — Replaced by ShhhPillView

### Unchanged Files
- `AppState.swift` — No changes needed (same published properties)
- `PythonBridge.swift` — No changes needed
- `ProtocolParser.swift` — No changes needed
- `MenuBarView.swift` — No changes needed
- `ShhhApp.swift` — No changes needed

## State Mapping

| AppDelegate state | Pill state |
|-------------------|------------|
| `status == .idle`, no hover | IDLE (bar) |
| `status == .idle`, hover | HOVER (expanded pill) |
| `status == .recording` | RECORDING (waveform + dropdown) |
| `status == .processing` | PROCESSING (dots + dropdown) |

Hover is tracked locally in the SwiftUI view via `@State var isHovered: Bool`.

## NSPanel Configuration

Same as current setup but single panel:
- Style: `.nonactivatingPanel` + `.borderless`
- Level: `.floating`
- Background: `.clear`, opaque: `false`
- Collection behavior: `.canJoinAllSpaces` + `.fullScreenAuxiliary`
- Size: 400x200 (oversized, transparent background)
- Position: top-center, y = screen.height - 200 (top of screen in macOS coordinates)
- Accepts mouse events for hover tracking
