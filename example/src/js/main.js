import { HCECapacitorPlugin } from 'capacitor-hce-plugin';
const logHistory = [];
document.addEventListener("DOMContentLoaded", async (event) => {

    await HCECapacitorPlugin.addListener(
        'onStatusChanged',
        (info) => {
            logHistory.push(
                { message: info.eventName, timestamp: new Date().toISOString() }
            )
            const newLogHistory = logHistory.slice()
            const liHtmlContent = newLogHistory.reverse().map(l => `<li><strong>${l.message}</strong> | ${l.timestamp}</li>`)
            document.getElementById('log-history').innerHTML = liHtmlContent.join('')
        },
      )

    const isNfcSupported = await HCECapacitorPlugin.isNfcSupported();
    if(isNfcSupported.supported) {
        document.getElementById('nfc-is-supported').style.display = 'block';
    } else {
        document.getElementById('nfc-is-not-supported').style.display = 'block';
    }

    const isNfcEnabled = await HCECapacitorPlugin.isNfcEnabled();
    if(isNfcEnabled.enabled) {
        document.getElementById('nfc-is-enabled').style.display = 'block';
    } else {
        document.getElementById('nfc-is-not-enabled').style.display = 'block';
    }

    const isNfcHceSupported = await HCECapacitorPlugin.isNfcHceSupported();
    if(isNfcHceSupported.supported) {
        document.getElementById('nfc-hce-is-enabled').style.display = 'block';
    } else {
        document.getElementById('nfc-hce-is-not-enabled').style.display = 'block';
    }

    const isSecureNfcEnabled = await HCECapacitorPlugin.isSecureNfcEnabled();
    if(isSecureNfcEnabled.enabled) {
        document.getElementById('secure-nfc-is-enabled').style.display = 'block';
    } else {
        document.getElementById('secure-nfc-is-not-enabled').style.display = 'block';
    }
});

window.stopHCE = async () => {
    await HCECapacitorPlugin.stopNfcHce()
}

window.startHCE = async () => {
    await HCECapacitorPlugin.startNfcHce({
        content: 'https://www.google.com',
        persistMessage: false
    })
}
