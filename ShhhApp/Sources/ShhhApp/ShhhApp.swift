import SwiftUI

@main
struct ShhhApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        MenuBarExtra("Shhh", systemImage: delegate.menuBarIcon) {
            MenuBarView()
                .environmentObject(delegate)
        }
    }
}
