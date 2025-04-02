import UIKit
import Capacitor

@available(iOS 17.4, *)
class MyViewController: CAPBridgeViewController {
    // additional code
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(IosEmulator())
    }
}
