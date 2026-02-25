// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ShhhApp",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(
            name: "ShhhApp",
            path: "Sources/ShhhApp"
        ),
    ]
)
