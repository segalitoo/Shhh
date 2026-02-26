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
            let y = screen.frame.height - panelHeight - 13
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
