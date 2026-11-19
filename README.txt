Chess Trainer 6.7.7 — Direct Lobby QR and Game Options

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

Railway deployment: upload the full package and rebuild the Docker image. The Dockerfile copies the ICO, PNG, SVG and vendor files into the served app. No Railway variables are required for direct offline pairing.

6.7.4 includes SVG, PNG and ICO favicon formats with cache-busted URLs. Keep favicon.svg, favicon.png and favicon.ico beside index.html when deploying.


6.7.3 removes the in-game “Next game” clock selector. Use New game to return to the pre-game lobby, where the next clock can be chosen. The same lobby has a checkbox to turn automatic board rotation on or off; the preference is remembered.

6.7.4 fixes the browser-tab icon by including ICO and PNG fallbacks and refreshing the service worker cache.

6.7.5 fixes the Railway image build: it now copies all favicon formats and the vendor folder into the container. The browser uses /favicon.ico as its primary icon.

6.7.6 adds a reliable continue-from-opening action against the bot, keeps the player’s color at the bottom in every non-local mode, opens the position selector for middlegame and endgame scenarios, and makes random scenario changes available during play after confirmation. Promotion choices now use a wider compact dialog with fully visible pieces.

6.7.7 changes Direct offline PvP into a lobby-first handshake. The host creates the lobby, chooses White/Black/random and a clock in the lobby, then the guest scans the invite. The guest’s return QR appears automatically for the host to scan. The game starts with the host-selected color and clock.
