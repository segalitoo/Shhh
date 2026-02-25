import SwiftUI

/// Small circular on/off button for the floating toggle.
struct ToggleButtonView: View {
    @ObservedObject var delegate: AppDelegate

    var body: some View {
        Button(action: {
            delegate.toggleRecording()
        }) {
            ZStack {
                Circle()
                    .fill(delegate.isRecording ? Color.red : Color(white: 0.35))
                    .frame(width: 44, height: 44)
                    .shadow(color: .black.opacity(0.3), radius: 4, y: 2)

                Image(systemName: delegate.isRecording ? "stop.fill" : "mic.fill")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
            }
        }
        .buttonStyle(.plain)
        .scaleEffect(delegate.isRecording ? 1.1 : 1.0)
        .animation(.easeInOut(duration: 0.3), value: delegate.isRecording)
    }
}
