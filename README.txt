Chess Trainer 5.6.0 — visual theory edition

This Railway build keeps the 5.5 trainer features and saved-game behavior, removes the speaking coach, voice controls, coach portraits, and sample audio, and adds annotated position diagrams to opening, middlegame, and endgame theory. The diagrams render from the actual chess position using the board theme; highlighted squares and an arrow illustrate the move being discussed. Candidate moves are suggestions, not a required solution.

Files for Railway: index.html, service-worker.js, server.js, package.json, Dockerfile. Replace those files in the project and redeploy. No coach image or audio files are needed.

The board and chess pieces remain part of the game interface. Move sounds are synthesized in the browser and do not use voice files or an external speech service.
