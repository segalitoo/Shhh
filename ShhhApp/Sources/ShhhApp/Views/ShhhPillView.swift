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
