import SwiftUI

/// Floating overlay showing live transcript text.
struct PreviewPanelView: View {
    @ObservedObject var delegate: AppDelegate

    var body: some View {
        Group {
            if !delegate.interimText.isEmpty {
                Text(delegate.interimText)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white)
                    .lineLimit(3)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.black.opacity(0.75))
                    )
                    .frame(maxWidth: 380)
            } else {
                Color.clear.frame(width: 1, height: 1)
            }
        }
    }
}
