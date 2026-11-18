Chess Trainer 6.6.1 — Soft Highlights and Local Controls

Direct offline play between two devices on the same Wi-Fi, without an Internet connection, a host PC, a lobby server or account. Existing Railway online, LAN-hosted and one-device local modes remain available.

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


6.6.0 visual updates
- Board squares now keep the selected board theme and material. In opening training, the full suggested move squares are solid green; the most recent played move squares are solid yellow.
- Local 2-player games no longer show a resign control.
- Refined spacing, typography, card hierarchy, board framing, button states, focus rings, scrollbar colors and responsive behavior for a calmer, more consistent interface.
- Direct offline QR play, LAN mode and Railway online lobbies remain included.

To deploy this update on Railway, replace index.html, service-worker.js and package.json, and keep the vendor folder from this package. The server.js and Dockerfile from the previous release are still compatible. Reload the deployed page once while online on each device so the new service worker can cache the update before offline use.

6.6.1 updates
- In bot games and every PvP mode, trainer move hints are suppressed, including any stale hint left over from another mode. Legal destinations still appear after you select a piece.
- The last move is marked in a softer, translucent-looking yellow. Trainer suggestions (in trainer modes only) use a soft green blend, and ordinary squares keep the active board palette.
- Local 2-player now has Undo turn (reverses the most recent complete turn, or the first move if only one exists) and Abort game (asks before discarding the position). There is no resign button in this mode.
