import SwiftUI
import Combine

/// Dictation engine status.
enum DictationStatus: String {
    case idle
    case recording
    case processing
}

/// Central state for the Shhh app. Owned by AppDelegate, observed by all views.
@MainActor
class AppDelegate: NSObject, NSApplicationDelegate, ObservableObject {
    @Published var status: DictationStatus = .idle
    @Published var interimText: String = ""
    @Published var isPreviewVisible: Bool = true

    var bridge: PythonBridge?
    var windowManager: FloatingWindowManager?

    var isRecording: Bool { status == .recording }

    /// SF Symbol name for the current status (used by MenuBarExtra).
    var menuBarIcon: String {
        switch status {
        case .idle: return "mic"
        case .recording: return "mic.fill"
        case .processing: return "ellipsis.circle"
        }
    }

    nonisolated func applicationDidFinishLaunching(_ notification: Notification) {
        Task { @MainActor in
            // Hide dock icon
            NSApp.setActivationPolicy(.accessory)

            // Start Python bridge
            bridge = PythonBridge(delegate: self)
            bridge?.start()

            // Create floating windows
            windowManager = FloatingWindowManager(delegate: self)
            windowManager?.showAll()
        }
    }

    nonisolated func applicationWillTerminate(_ notification: Notification) {
        Task { @MainActor in
            bridge?.quit()
        }
    }

    func toggleRecording() {
        bridge?.toggleRecording()
    }
}
