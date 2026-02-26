import SwiftUI
import Combine
import AVFoundation
import ApplicationServices

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

            // Request microphone permission (triggers TCC dialog on first run)
            await requestMicrophoneAccess()

            // Request Accessibility (prompts user to grant in System Settings)
            requestAccessibilityAccess()

            // Start Python bridge
            bridge = PythonBridge(delegate: self)
            bridge?.start()

            // Create floating windows
            windowManager = FloatingWindowManager(delegate: self)
            windowManager?.showAll()
        }
    }

    private func requestMicrophoneAccess() async {
        let status = AVCaptureDevice.authorizationStatus(for: .audio)
        if status == .notDetermined {
            let granted = await AVCaptureDevice.requestAccess(for: .audio)
            if !granted {
                interimText = "Microphone access denied. Enable in System Settings > Privacy > Microphone."
            }
        } else if status == .denied || status == .restricted {
            interimText = "Microphone access denied. Enable in System Settings > Privacy > Microphone."
        }
    }

    private func requestAccessibilityAccess() {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
        let trusted = AXIsProcessTrustedWithOptions(options)
        if !trusted {
            // macOS will show a prompt directing user to System Settings > Accessibility
            print("Accessibility not yet granted — user prompted.")
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
