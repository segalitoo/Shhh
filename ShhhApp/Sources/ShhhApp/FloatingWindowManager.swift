import SwiftUI
import AppKit
import Combine

/// Manages the floating NSPanel windows (toggle button + preview).
@MainActor
class FloatingWindowManager {
    private var togglePanel: NSPanel?
    private var previewPanel: NSPanel?
    private weak var delegate: AppDelegate?
    private var previewCancellable: AnyCancellable?

    init(delegate: AppDelegate) {
        self.delegate = delegate
    }

    /// Create and show all floating windows.
    func showAll() {
        setupTogglePanel()
        setupPreviewPanel()
    }

    // MARK: - Toggle Button Panel

    private func setupTogglePanel() {
        guard let delegate = delegate else { return }

        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 60, height: 60),
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

        // Position: bottom-center of main screen
        if let screen = NSScreen.main {
            let x = (screen.frame.width - 60) / 2
            let y: CGFloat = 40
            panel.setFrameOrigin(NSPoint(x: x, y: y))
        }

        let hostingView = NSHostingView(rootView: ToggleButtonView(delegate: delegate))
        hostingView.frame = NSRect(x: 0, y: 0, width: 60, height: 60)
        panel.contentView = hostingView
        panel.orderFront(nil)

        self.togglePanel = panel
    }

    // MARK: - Preview Panel

    private func setupPreviewPanel() {
        guard let delegate = delegate else { return }

        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 400, height: 80),
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

        // Position: top-center, just below the menu bar
        if let screen = NSScreen.main {
            let x = (screen.frame.width - 400) / 2
            let y = screen.visibleFrame.maxY - 80
            panel.setFrameOrigin(NSPoint(x: x, y: y))
        }

        let hostingView = NSHostingView(rootView: PreviewPanelView(delegate: delegate))
        hostingView.frame = NSRect(x: 0, y: 0, width: 400, height: 80)
        panel.contentView = hostingView

        self.previewPanel = panel

        // Show/hide panel based on interim text and preview visibility.
        // Capture panel reference locally to avoid capturing self in the sink closure.
        let previewPanel = panel
        previewCancellable = delegate.$interimText
            .combineLatest(delegate.$isPreviewVisible)
            .receive(on: DispatchQueue.main)
            .sink { text, visible in
                if visible && !text.isEmpty {
                    previewPanel.orderFront(nil)
                } else {
                    previewPanel.orderOut(nil)
                }
            }
    }
}
