Chess Trainer 6.1.0 — Opening and Endgame Update

Railway files: index.html, service-worker.js, server.js, package.json and Dockerfile. Replace these files in the existing Railway project and redeploy.

Middlegame trainer:
- The scenario pool contains all 68 recorded opening lines from the full 48-opening library, each starting at its recorded final position, plus the existing strategic middlegame scenarios.
- Opening continuations are selected randomly and labelled with the opening and variation.

Opening trainer:
- Openings and gambits are grouped into expandable cards. Click an opening to reveal its variations.
- The first action is Random line (default); each listed line can also be selected directly. Starting a line begins a new trainer opening while expanding/collapsing a card leaves the current game untouched.
- The old separate variation panel is removed.

Endgame trainer:
- There are 32 endgame scenarios, spanning pawn, rook, bishop, knight and queen endings, races, fortresses and opposite-colored bishops. Each is played freely until checkmate or a rules-based draw.

All other modes, board settings, save/restore behavior, sound, and Railway setup remain included.
