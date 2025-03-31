import Foundation
import Capacitor
import CoreNFC

@available(iOS 17.4, *)
@objc(IosEmulator)
public class IosEmulator: CAPPlugin {

    private var timeoutTask: DispatchWorkItem?  // Store timeout task

    @objc func StartIosEmulation(_ call: CAPPluginCall) {
        let stringData = call.getString("Data") ?? "Error Reading Data"
        let utf8Data = Data(stringData.utf8)
        let payloadLength = utf8Data.count + 3
        let ndefMessage: [UInt8] = [
            0xD1,
            0x01,
            UInt8(payloadLength),
            0x54,
            0x02,
            0x65, 0x6E
        ] + [UInt8](utf8Data)

        let ndefMessageLength = UInt16(ndefMessage.count)
        let ndefFile: [UInt8] = [
            UInt8((ndefMessageLength >> 8) & 0xFF),
            UInt8(ndefMessageLength & 0xFF)
        ] + ndefMessage

        var selectedFile: UInt16? = nil

        let processAPDU: (_: Data) -> (Data, Bool) = { capdu in
            print("Processing APDU:", capdu.map { String(format: "%02X", $0) }.joined())

            if capdu == Data([0x00, 0xA4, 0x04, 0x00, 0x07, 0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01, 0x00]) {
                print("AID selected")
                return (Data([0x90, 0x00]), false)
            }

            if capdu == Data([0x00, 0xA4, 0x00, 0x0C, 0x02, 0xE1, 0x04]) {
                selectedFile = 0xE103
                print("NDEF file selected")
                return (Data([0x90, 0x00]), false)
            }

            if capdu.starts(with: [0x00, 0xB0]) {
                guard selectedFile == 0xE103 else {
                    print("Error: No valid file selected before reading")
                    return (Data([0x6A, 0x82]), false)
                }

                let offset = (Int(capdu[2]) << 8) | Int(capdu[3])
                let lengthRequested = capdu.count > 4 ? Int(capdu[4]) : 0

                if offset >= ndefFile.count {
                    return (Data([0x6A, 0x82]), false)
                }

                let endIndex = min(offset + lengthRequested, ndefFile.count)
                let slice = ndefFile[offset..<endIndex]
                let isComplete = endIndex >= ndefFile.count
                return (Data(slice) + Data([0x90, 0x00]), isComplete)
            }

            print("Unknown command")
            return (Data([0x6A, 0x82]), false)
        }

        Task {
            guard NFCReaderSession.readingAvailable else {
                print("NFC is not available.")
                return
            }
            let cardSession: CardSession
            do {
                cardSession = try await CardSession()
                print("Card session acquired.")
            } catch {
                print("Failed to acquire NFC session: \(error)")
                return
            }
            
            do {
                if await cardSession.isEmulationInProgress == false {
                    cardSession.alertMessage = String(localized: "Novietojiet ierīci virs NFC lasītāja.")
                    try await cardSession.startEmulation()
                    print("Emulation started.")
                }
            } catch {
                print("Error starting emulation: \(error)")
                return
            }

            startTimeout(for: cardSession)

            for try await event in cardSession.eventStream {
                switch event {
                case .sessionStarted, .readerDetected:
                    startTimeout(for: cardSession)
                case .readerDeselected:
                    await stopEmulation(cardSession, call: call, message: "Reader deselected. Stopping emulation.", success: true)
                case .received(let cardAPDU):
                    startTimeout(for: cardSession)
                    do {
                        let (responseAPDU, isComplete) = processAPDU(cardAPDU.payload)
                        if !responseAPDU.isEmpty {
                            try await cardAPDU.respond(response: responseAPDU)
                            if isComplete {
                                await stopEmulation(cardSession, call: call, message: "NDEF data transfer complete, stopping emulation.", success: true)
                            }
                        }
                    } catch {
                        print("Error responding to APDU: \(error)")
                    }
                case .sessionInvalidated:
                    await stopEmulation(cardSession, call: call, message: "Session invalidated.", success: false)
                }
            }
        }
    }

    private func startTimeout(for cardSession: CardSession) {
        timeoutTask?.cancel()
        timeoutTask = DispatchWorkItem { [weak self] in
            Task {
                cardSession.alertMessage = String(localized: "Notikusi Kļūda. Mēģiniet Vēlreiz!")
                
                await self?.stopEmulation(cardSession, call: nil, message: "Emulation stopped due to inactivity.", success: false)
            }

            }
        DispatchQueue.global().asyncAfter(deadline: .now() + 15, execute: timeoutTask!)
    }

    private func stopEmulation(_ cardSession: CardSession, call: CAPPluginCall?, message: String, success: Bool) async {
        timeoutTask?.cancel()
        timeoutTask = nil
        self.notifyListeners("sessionInvalidated", data: ["message": message])
        do {
            await cardSession.stopEmulation(status: success ? .success : .failure)
            cardSession.invalidate()
            call?.resolve()
        } catch {
            print("Error stopping emulation: \(error)")
        }
    }
}

extension Data {
    func hexEncodedString() -> String {
        return self.map { String(format: "%02X", $0) }.joined()
    }
}
