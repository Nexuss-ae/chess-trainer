Chess Trainer 6.5.0 — Direct Offline PvP

New: Direct offline play between two devices on the same Wi-Fi, without an Internet connection, a host PC, a lobby server or account. Existing Railway online, LAN-hosted and one-device local modes remain available.

Before going offline
1. On both devices, open the Chess Trainer while Internet is available at least once and leave it loaded. This lets the service worker save the page and its QR helper for offline use. In browser settings, install/add the site to the home screen if you want an app-like shortcut.
2. At school, connect both devices to the same Wi-Fi. Open the saved page on each. Choose PvP → Direct offline.

Pair and play
1. On one device choose Create invite · White. Pick no clock or 5, 10, 20 or 30 minutes. It displays a QR code.
2. On the other device choose Join invite · Black, then Scan QR with camera. Allow camera access and scan the White invite.
3. The Black device displays its answer QR. On White choose Scan QR with camera and scan the answer. The game starts when the direct connection is ready.
4. If camera scanning is unavailable, use the pairing-data field and copy/paste controls. A text transfer method between devices is needed for that fallback.

The offer and answer are exchanged locally via the QR codes; chess moves then travel directly over an encrypted WebRTC data channel. No game server or STUN service is contacted. Both players need to keep the page open during the match. Closing/reloading the page ends the direct session. Timed games keep their clocks synchronized at each move; brief network lag can make clocks differ slightly between updates.

Network and browser notes
- Both devices must be on the same Wi-Fi, and the Wi-Fi must allow devices to communicate directly. Some school guest networks block this (client isolation); if pairing does not reach Connected, the network administrator would need to allow peer-to-peer traffic.
- Offline mode works only after the page has been cached while online. On iPhone/iPad, background browser restrictions can pause a page; keep the app visible while playing.
- Camera QR scanning depends on browser support and permissions. Manual pairing data is provided as a fallback.
- The direct session is only kept in the current open tabs. It cannot resume after either tab closes.

Railway deployment
Replace the existing files with the changed files from this folder: index.html, service-worker.js, package.json, and vendor/qrcode.min.js, vendor/jsQR.js, vendor/pako.min.js and their accompanying LICENSE files. Keep server.js, Dockerfile and start-lan.bat unchanged. No Railway environment variable is required. Commit and redeploy as usual. The added QR library is bundled locally and is not fetched from the Internet at runtime.

