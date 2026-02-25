import SwiftUI

/// Dropdown menu content for the menu bar icon.
struct MenuBarView: View {
    @EnvironmentObject var delegate: AppDelegate

    var body: some View {
        Button(delegate.isRecording ? "Stop Recording" : "Start Recording") {
            delegate.toggleRecording()
        }
        .keyboardShortcut("r", modifiers: .command)

        Divider()

        Toggle("Live Preview", isOn: $delegate.isPreviewVisible)

        Divider()

        Text(statusLabel)
            .font(.caption)
            .foregroundColor(.secondary)

        Divider()

        Button("Quit Shhh") {
            NSApplication.shared.terminate(nil)
        }
        .keyboardShortcut("q", modifiers: .command)
    }

    private var statusLabel: String {
        switch delegate.status {
        case .idle: return "Status: Idle"
        case .recording: return "Status: Recording..."
        case .processing: return "Status: Processing..."
        }
    }
}
