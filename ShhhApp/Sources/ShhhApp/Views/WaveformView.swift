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
        let center = Double(barCount - 1) / 2.0
        let distance = abs(Double(index) - center) / center
        let maxH: CGFloat = 16
        let minH: CGFloat = 6
        return maxH - CGFloat(distance) * (maxH - minH)
    }

    private func duration(for index: Int) -> Double {
        0.4 + Double(index % 3) * 0.15
    }

    private func delay(for index: Int) -> Double {
        Double(index) * 0.08
    }
}
