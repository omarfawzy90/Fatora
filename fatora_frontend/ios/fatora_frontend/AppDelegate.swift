import UIKit
import React 

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  
  // Use the standard delegate for simplicity
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    
    // Create the React Native bridge
    let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
    let rootView = RCTRootView(bridge: bridge!, moduleName: "fatora_frontend", initialProperties: nil)
    
    // Set background color to match the launch screen
    if let backgroundColor = rootView.backgroundColor {
      rootView.backgroundColor = backgroundColor
    }

    self.window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    self.window?.rootViewController = rootViewController
    self.window?.makeKeyAndVisible()
    
    return true
  }
}

// Implement the RCTBridgeDelegate to provide the source URL
extension AppDelegate: RCTBridgeDelegate {
  func sourceURL(for bridge: RCTBridge) -> URL? {
    #if DEBUG
      // This is the standard, robust way to find the Metro server on localhost
      return URL(string:"http://192.168.100.21:8081/index.bundle?platform=ios&dev=true")

    #else
      // This is for production release builds
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
