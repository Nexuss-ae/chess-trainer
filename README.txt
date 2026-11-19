Chess Trainer 6.9.0 — Curated Gambit Lines

- Added the Tennison Gambit and its ICBM queen trap, Fried Liver and Lolli attacks, the Nakhmanson and Belgrade knight-based gambits, plus the Traxler, Blackburne Shilling and Rousseau gambits.
- Added complete, legal example games ending in checkmate for the Fried Liver, Traxler, Blackburne Shilling and Rousseau tactical traps.
- The ICBM line correctly ends with a queen win: it is not a forced checkmate.
- Replayed all 48 explicit gambit lines move by move to check legality. Gambit lines are now only curated branches; the app no longer invents opponent replies or extends gambits with heuristic moves. Random line selection skips branches explicitly marked as traps, blunders or queen traps; those remain available by direct selection.
- Legal-move replay verifies that the recorded moves are possible; it is not a chess-engine evaluation proving every branch is objectively best. Tactical traps are labeled, and should not be mistaken for normal best-play outcomes.
- Corrected the Elephant Gambit to the standard 1.e4 e5 2.Nf3 d5 3.exd5 e4 main line.
- Selecting a gambit from the expanded library now starts that gambit directly.
- The success screen distinguishes a completed training line from a complete checkmate example.

Accuracy note: gambits and traps do not force a win against best defense. Mating branches are labeled as tactical traps and are kept out of random selection.

Release package files: index.html, service-worker.js, package.json, server.js, Dockerfile, favicon files and vendor libraries. Deploy the complete folder if using the Railway configuration.

Previous release notes follow.

Chess Trainer 6.8.1 - Longer Opening Variations

- Opening lines now finish in a locked success screen with confetti; there is no transition into a bot game.
- Expanded both color repertoires with additional openings and gambits.
- Every listed opening has at least five legal reply/practice lines, extended to about ten moves for each color (20–21 plies when the position allows). Lines labeled Practice alternative or extended practice are legal generated continuations, not claimed as forced book theory.
Chess Trainer 6.7.9 — Title Update

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

6.7.8: the Direct PvP host sees lobby settings, an invite QR, a player-QR scanner and a Start game button. Start game remains disabled until the guest has joined and the data channel is open. The guest view is reduced to the QR area and Scan QR code. Local and Direct pre-game lobbies clear the board display. Navigation now groups bot play under Singleplayer and Local/Direct under Multiplayer, and the selected menu item is synchronized with the visible mode.

6.7.9 changes the page heading and browser tab title to “chess.com fake xD”.
