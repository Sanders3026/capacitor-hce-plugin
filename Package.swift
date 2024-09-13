// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "HcePlugin",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "HcePlugin",
            targets: ["HCECapacitorPluginPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "HCECapacitorPluginPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/HCECapacitorPluginPlugin"),
        .testTarget(
            name: "HCECapacitorPluginPluginTests",
            dependencies: ["HCECapacitorPluginPlugin"],
            path: "ios/Tests/HCECapacitorPluginPluginTests")
    ]
)