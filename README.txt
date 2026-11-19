Chess Trainer 6.7.3 — Local Lobby Options

Chess Trainer 6.7.1 — Local Lobby and Board Orientation

PvP modes: Local 2-player on one device and Direct offline over same-Wi-Fi device-to-device pairing. Online lobby and LAN lobby have been removed.

Local 2-player
- The initial pre-game lobby lets you choose a clock before starting.
- After a game, New game returns to that pre-game lobby instead of immediately starting another match. The current clock choice is carried back into the lobby.
- The lobby checkbox controls whether the board rotates for the side to move. This preference is remembered and applies when resuming or undoing too.

Direct offline
- Each player keeps their own color at the bottom throughout the match.
- Pair with the invite and answer QR codes. QR codes are rendered directly as SVG and use the browser’s built-in compression where available; the bundled QR library and scanner are cached for offline use.
- Both devices must open the current deployed page once while online before using it offline. Keep both tabs open during play. Some Wi-Fi networks block peer-to-peer traffic.

Railway deployment: replace index.html, service-worker.js, server.js and package.json, and include vendor/. No Railway variables are required for direct offline pairing.

6.7.2 adds a simple chess pawn favicon for the browser tab. Keep favicon.svg beside index.html when deploying.


6.7.3 removes the in-game “Next game” clock selector. Use New game to return to the pre-game lobby, where the next clock can be chosen. The same lobby has a checkbox to turn automatic board rotation on or off; the preference is remembered.
