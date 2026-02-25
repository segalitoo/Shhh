import SwiftUI
import AppKit
import Combine

/// Manages the floating NSPanel windows (toggle button + preview).
/// Full implementation in Tasks 6 and 7.
@MainActor
class FloatingWindowManager {
    private weak var delegate: AppDelegate?

    init(delegate: AppDelegate) {
        self.delegate = delegate
    }

    /// Create and show all floating windows.
    func showAll() {
        // TODO: Task 6 (toggle button) and Task 7 (preview panel)
    }
}
