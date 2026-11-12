Chess Trainer 5.7.0 — Strategic Theory Edition

Railway deployment files: index.html, service-worker.js, server.js, package.json and Dockerfile. Replace those files in the existing Railway project and redeploy. No coach, avatar, voice, or audio assets are required.

What changed:
- Opening theory is available from the persistent left navigation. The navigation button stays available while scrolling.
- The theory library includes White and Black openings, gambits, search, line selection, and move-by-move diagrams without changing the current game.
- Each selected move shows the resulting position, the moved piece’s controlled squares, available piece routes where legal, the purpose of the move, and a concrete trade-off against an alternative.
- The analysis view can be expanded to a large screen view. Press Escape or use Close expanded view to return.
- The opening, middlegame and endgame trainer theory remains in place. The bot, settings, and saved-game behavior remain available.

The move influence map is generated from chess position data; it marks squares the moved piece attacks or controls after the move. The line’s later moves are examples, not mandatory answers.
