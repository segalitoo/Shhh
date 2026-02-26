import SwiftUI

/// Unified pill UI — Pure Minimal style.
/// Morphs between idle bar → hover pill → recording blob (waveform + text inside) → processing blob.
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
        // Single blob — everything lives inside it
        pillContent
            .frame(width: pillWidth, height: pillHeight)
            .background(pillBackground)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .shadow(color: .black.opacity(0.35), radius: 10, x: 0, y: 4)
            .frame(height: 80) // Fixed container — pill expands from center
            .onTapGesture {
                delegate.toggleRecording()
            }
            .onHover { hovering in
                // Only update hover for idle state (not while recording/processing)
                if delegate.status == .idle {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.7)) {
                        isHovered = hovering
                    }
                }
            }
            .animation(.spring(response: 0.5, dampingFraction: 0.65), value: pillState)
            .frame(maxWidth: 400, maxHeight: 200, alignment: .top)
    }

    // MARK: - Pill Content

    @ViewBuilder
    private var pillContent: some View {
        switch pillState {
        case .idle:
            Color.clear // The pill shape itself is the visual

        case .hover:
            Text("shhh")
                .font(.system(size: 15, weight: .semibold, design: .rounded))
                .tracking(2)
                .foregroundColor(.white.opacity(0.9))
                .transition(.opacity)

        case .recording:
            VStack(spacing: 8) {
                WaveformView(barCount: 9)
                    .frame(height: 22)

                Text(transcriptText)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white.opacity(delegate.interimText.isEmpty ? 0.35 : 0.5))
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
            .padding(.horizontal, 20)
            .transition(.opacity)

        case .processing:
            VStack(spacing: 8) {
                HStack(spacing: 6) {
                    ForEach(0..<3, id: \.self) { i in
                        PulsingDot(delay: Double(i) * 0.2)
                    }
                }

                Text("Processing...")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white.opacity(0.35))
            }
            .transition(.opacity)
        }
    }

    // MARK: - Transcript

    private var transcriptText: String {
        delegate.interimText.isEmpty ? "Listening..." : delegate.interimText
    }

    // MARK: - Pill Dimensions

    private var pillWidth: CGFloat {
        switch pillState {
        case .idle: return 48
        case .hover: return 100
        case .recording: return 220
        case .processing: return 220
        }
    }

    private var pillHeight: CGFloat {
        switch pillState {
        case .idle: return 8
        case .hover: return 38
        case .recording: return 72
        case .processing: return 72
        }
    }

    private var cornerRadius: CGFloat {
        switch pillState {
        case .idle: return 4
        case .hover: return 19
        case .recording: return 24
        case .processing: return 24
        }
    }

    // MARK: - Pill Background

    private var pillBackground: some View {
        RoundedRectangle(cornerRadius: cornerRadius)
            .fill(Color.black.opacity(pillOpacity))
    }

    private var pillOpacity: Double {
        switch pillState {
        case .idle: return 0.5
        case .hover: return 0.85
        case .recording: return 0.95
        case .processing: return 0.95
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
