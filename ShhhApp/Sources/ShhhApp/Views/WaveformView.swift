import SwiftUI

/// Animated waveform bars for the recording state.
/// Pure Minimal style: 9 wider bars with warm orange-red gradient.
struct WaveformView: View {
    var barCount: Int = 9
    @State private var animating = false

    /// Warm orange-red gradient (#ff6b6b → #ee5a24)
    private let warmGradient = LinearGradient(
        colors: [
            Color(red: 1.0, green: 0.42, blue: 0.42),   // #ff6b6b
            Color(red: 0.93, green: 0.35, blue: 0.14),   // #ee5a24
        ],
        startPoint: .top,
        endPoint: .bottom
    )

    var body: some View {
        HStack(spacing: 3) {
            ForEach(0..<barCount, id: \.self) { index in
                RoundedRectangle(cornerRadius: 2)
                    .fill(warmGradient)
                    .frame(width: 3.5, height: animating ? barHeight(for: index) : 4)
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
        let center = Double(barCount - 1) / 2.0
        let distance = abs(Double(index) - center) / center
        let maxH: CGFloat = 22
        let minH: CGFloat = 6
        return maxH - CGFloat(distance) * (maxH - minH)
    }

    private func duration(for index: Int) -> Double {
        0.5 + Double(index % 3) * 0.12
    }

    private func delay(for index: Int) -> Double {
        Double(index) * 0.06
    }
}
