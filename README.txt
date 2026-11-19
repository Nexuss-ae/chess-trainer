Chess Trainer 6.7.0 — Local and Direct Offline PvP

This release keeps the two PvP modes in the trainer:
- Local 2-player: both people use one device.
- Direct offline: pair two devices using QR codes over the same Wi-Fi. No lobby server or Internet connection is used for the match.

Direct offline setup
1. Both devices must open the latest deployed page once while online so the service worker can cache the page and QR tools.
2. At school, both devices join the same Wi-Fi and open the saved site.
3. Choose PvP → Direct offline. One person creates the invite as White, the other joins as Black and scans the invite. Scan the reply QR on White’s screen to finish pairing.
4. The game starts after the direct connection is ready. Choose no clock or 5, 10, 20 or 30 minutes.

The QR is drawn locally as SVG from the bundled QR generator. The QR, scanner and compression scripts are included in vendor/ and cached for offline use. No QR or game server is contacted during pairing or play. Browser camera permission is needed to scan; manual copy/paste remains available. Both tabs must stay open. Some school Wi-Fi networks block device-to-device connections.

Railway deployment
Replace index.html, service-worker.js, server.js and package.json, and include the vendor/ folder. LAN lobby startup files are no longer part of this release. Railway still serves the static site; direct offline matches do not use a Railway game lobby.
