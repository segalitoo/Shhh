# Shhh Pill UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the two-panel UI (toggle button + preview) with a single unified pill at top-center that morphs between idle/hover/recording/processing states.

**Architecture:** Single NSPanel with a SwiftUI view that animates between four visual states. Hover detection via SwiftUI `.onHover`. Waveform is a separate reusable view with staggered sine-wave bar animations.

**Tech Stack:** SwiftUI, NSPanel, Combine, AppKit (NSHostingView, NSTrackingArea)

**Design Doc:** `docs/plans/2026-02-26-shhh-pill-ui-design.md`

---

### Task 1: Create WaveformView

**Files:**
- Create: `ShhhApp/Sources/ShhhApp/Views/WaveformView.swift`

**Step 1: Create the waveform animation view**

```swift
import SwiftUI

/// Animated waveform bars for the recording state.
struct WaveformView: View {
    var barCount: Int = 7
    var color: Color = .white
    @State private var animating = false

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<barCount, id: \.self) { index in
                RoundedRectangle(cornerRadius: 1.5)
                    .fill(color)
                    .frame(width: 2, height: animating ? barHeight(for: index) : 4)
                    .animation(
                        .easeInOut(duration: duration(for: index))
                        .repeatForever(autoreverses: true)
                        .delay(delay(for: index)),
                        value: animating
                    )
            }
        }
        .onAppear { animating = true }
        .onDisappear { animating = false }
    }

    private func barHeight(for index: Int) -> CGFloat {
        // Taller bars toward center, shorter at edges
        let center = Double(barCount - 1) / 2.0
        let distance = abs(Double(index) - center) / center
        let maxH: CGFloat = 16
        let minH: CGFloat = 6
        return maxH - CGFloat(distance) * (maxH - minH)
    }

    private func duration(for index: Int) -> Double {
        // Vary duration slightly per bar for organic feel
        0.4 + Double(index % 3) * 0.15
    }

    private func delay(for index: Int) -> Double {
        // Stagger start times
        Double(index) * 0.08
    }
}
```

**Step 2: Build and verify compilation**

Run: `cd ShhhApp && swift build -c release 2>&1`
Expected: Build succeeds (view unused but compiles)

**Step 3: Commit**

```bash
git add ShhhApp/Sources/ShhhApp/Views/WaveformView.swift
git commit -m "feat: add WaveformView animated bars component"
```

---

### Task 2: Create ShhhPillView

**Files:**
- Create: `ShhhApp/Sources/ShhhApp/Views/ShhhPillView.swift`

**Step 1: Create the unified pill view with all four states**

```swift
import SwiftUI

/// Unified pill UI that morphs between idle/hover/recording/processing states.
struct ShhhPillView: View {
    @ObservedObject var delegate: AppDelegate
    @State private var isHovered = false

    // Current visual state derived from delegate + hover
    private var pillState: PillState {
        switch delegate.status {
        case .recording: return .recording
        case .processing: return .processing
        case .idle: return isHovered ? .hover : .idle
        }
    }

    var body: some View {
        VStack(spacing: 2) {
            // The pill itself
            pillContent
                .frame(width: pillWidth, height: pillHeight)
                .background(pillBackground)
                .clipShape(Capsule())
                .shadow(
                    color: pillState == .recording ? Color.red.opacity(0.3) : Color.clear,
                    radius: 8
                )
                .onTapGesture {
                    delegate.toggleRecording()
                }
                .onHover { hovering in
                    // Only update hover for idle state (not while recording/processing)
                    if delegate.status == .idle {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                            isHovered = hovering
                        }
                    }
                }

            // Dropdown text panel (recording + processing only)
            if showDropdown {
                dropdownPanel
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: pillState)
        .frame(maxWidth: 400, maxHeight: 200, alignment: .top)
    }

    // MARK: - Pill Content

    @ViewBuilder
    private var pillContent: some View {
        switch pillState {
        case .idle:
            Color.clear // The pill shape itself is the visual
        case .hover:
            Text("Shhh")
                .font(.system(size: 14, weight: .medium, design: .rounded))
                .foregroundColor(.white)
                .transition(.opacity)
        case .recording:
            WaveformView(barCount: 7, color: .white)
                .transition(.opacity)
        case .processing:
            HStack(spacing: 6) {
                ForEach(0..<3, id: \.self) { i in
                    PulsingDot(delay: Double(i) * 0.2)
                }
            }
            .transition(.opacity)
        }
    }

    // MARK: - Dropdown

    private var showDropdown: Bool {
        pillState == .recording || pillState == .processing
    }

    private var dropdownPanel: some View {
        Text(dropdownText)
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(delegate.interimText.isEmpty ? .white.opacity(0.5) : .white)
            .lineLimit(3)
            .frame(minWidth: 200, maxWidth: 320, alignment: .leading)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.black.opacity(0.85))
            )
    }

    private var dropdownText: String {
        delegate.interimText.isEmpty ? "Listening..." : delegate.interimText
    }

    // MARK: - Pill Dimensions

    private var pillWidth: CGFloat {
        switch pillState {
        case .idle: return 40
        case .hover: return 90
        case .recording: return 140
        case .processing: return 140
        }
    }

    private var pillHeight: CGFloat {
        switch pillState {
        case .idle: return 4
        case .hover: return 32
        case .recording: return 36
        case .processing: return 36
        }
    }

    // MARK: - Pill Background

    private var pillBackground: some View {
        Capsule().fill(Color.black.opacity(pillOpacity))
    }

    private var pillOpacity: Double {
        switch pillState {
        case .idle: return 0.5
        case .hover: return 0.8
        case .recording: return 0.85
        case .processing: return 0.85
        }
    }
}

// MARK: - Pill State

private enum PillState: Equatable {
    case idle, hover, recording, processing
}

// MARK: - Pulsing Dot

private struct PulsingDot: View {
    let delay: Double
    @State private var animating = false

    var body: some View {
        Circle()
            .fill(Color.white)
            .frame(width: 6, height: 6)
            .opacity(animating ? 1.0 : 0.3)
            .animation(
                .easeInOut(duration: 0.6)
                .repeatForever(autoreverses: true)
                .delay(delay),
                value: animating
            )
            .onAppear { animating = true }
    }
}
```

**Step 2: Build and verify compilation**

Run: `cd ShhhApp && swift build -c release 2>&1`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add ShhhApp/Sources/ShhhApp/Views/ShhhPillView.swift
git commit -m "feat: add ShhhPillView unified pill with all states"
```

---

### Task 3: Rewrite FloatingWindowManager for single panel

**Files:**
- Modify: `ShhhApp/Sources/ShhhApp/FloatingWindowManager.swift` (full rewrite)

**Step 1: Replace the two-panel manager with a single-panel manager**

Replace entire file contents with:

```swift
import SwiftUI
import AppKit
import Combine

/// Manages the single floating pill NSPanel at top-center of screen.
@MainActor
class FloatingWindowManager {
    private var pillPanel: NSPanel?
    private weak var delegate: AppDelegate?

    init(delegate: AppDelegate) {
        self.delegate = delegate
    }

    /// Create and show the pill panel.
    func showAll() {
        setupPillPanel()
    }

    private func setupPillPanel() {
        guard let delegate = delegate else { return }

        // Oversized transparent panel — only SwiftUI content is visible
        let panelWidth: CGFloat = 400
        let panelHeight: CGFloat = 200

        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: panelWidth, height: panelHeight),
            styleMask: [.nonactivatingPanel, .borderless],
            backing: .buffered,
            defer: false
        )
        panel.level = .floating
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        panel.isMovableByWindowBackground = false
        panel.hidesOnDeactivate = false

        // Accept mouse events for hover tracking
        panel.acceptsMouseMovedEvents = true
        panel.ignoresMouseEvents = false

        // Position: top-center, just below the top of screen
        if let screen = NSScreen.main {
            let x = (screen.frame.width - panelWidth) / 2
            // In macOS coordinates, y=0 is bottom. Place panel at top.
            let y = screen.frame.height - panelHeight - 8
            panel.setFrameOrigin(NSPoint(x: x, y: y))
        }

        let hostingView = NSHostingView(
            rootView: ShhhPillView(delegate: delegate)
                .frame(width: panelWidth, height: panelHeight, alignment: .top)
        )
        hostingView.frame = NSRect(x: 0, y: 0, width: panelWidth, height: panelHeight)
        panel.contentView = hostingView
        panel.orderFront(nil)

        self.pillPanel = panel
    }
}
```

**Step 2: Build and verify compilation**

Run: `cd ShhhApp && swift build -c release 2>&1`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add ShhhApp/Sources/ShhhApp/FloatingWindowManager.swift
git commit -m "refactor: single pill panel replacing toggle+preview panels"
```

---

### Task 4: Delete old view files

**Files:**
- Delete: `ShhhApp/Sources/ShhhApp/Views/ToggleButtonView.swift`
- Delete: `ShhhApp/Sources/ShhhApp/Views/PreviewPanelView.swift`

**Step 1: Remove the old view files**

```bash
rm ShhhApp/Sources/ShhhApp/Views/ToggleButtonView.swift
rm ShhhApp/Sources/ShhhApp/Views/PreviewPanelView.swift
```

**Step 2: Build and verify compilation**

Run: `cd ShhhApp && swift build -c release 2>&1`
Expected: Build succeeds with no references to deleted types

**Step 3: Commit**

```bash
git add -A ShhhApp/Sources/ShhhApp/Views/
git commit -m "cleanup: remove old ToggleButtonView and PreviewPanelView"
```

---

### Task 5: Build, bundle, and visual test

**Step 1: Build the release binary**

Run: `cd ShhhApp && swift build -c release 2>&1`
Expected: Build complete

**Step 2: Bundle the app**

Run: `cd /Users/rannsegal/Claude/Shhh && bash ShhhApp/bundle.sh`
Expected: App bundle created, codesigned

**Step 3: Launch and visual test**

Run: `open ShhhApp/.build/ShhhApp.app`

Verify:
- [ ] Thin dark bar visible at top-center of screen under the notch
- [ ] Hovering over bar → expands to pill showing "Shhh"
- [ ] Moving mouse away → collapses back to thin bar
- [ ] Clicking "Shhh" pill → starts recording, waveform animation appears, dropdown with "Listening..." slides down
- [ ] Speaking → dropdown shows live interim text
- [ ] Clicking waveform → stops recording, dots pulse, final text shown
- [ ] After 3s → collapses back to thin bar

**Step 4: Fix any visual issues found**

Adjust sizes, positions, timings as needed after seeing it live.

**Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: Shhh Pill UI — unified floating dictation pill"
```

---

### Task 6: Hover refinement (if needed)

NSPanel with `.nonactivatingPanel` may not receive hover events reliably since it doesn't take focus. If `.onHover` doesn't fire:

**Fallback approach — NSTrackingArea on the panel's content view:**

Add to `FloatingWindowManager.setupPillPanel()` after setting contentView:

```swift
// Ensure hover tracking works on non-activating panel
let trackingArea = NSTrackingArea(
    rect: hostingView.bounds,
    options: [.mouseEnteredAndExited, .activeAlways, .inVisibleRect],
    owner: hostingView,
    userInfo: nil
)
hostingView.addTrackingArea(trackingArea)
```

If SwiftUI `.onHover` still doesn't work, switch to an `NSView` subclass that posts hover state to AppDelegate via a `@Published var isHovered: Bool` property. Then ShhhPillView reads `delegate.isHovered` instead of local `@State`.

**This task is conditional — only needed if hover doesn't work in Task 5.**
