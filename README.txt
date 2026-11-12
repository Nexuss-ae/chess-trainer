Chess Trainer 5.9.0 — Board Visual Fix

Railway files: index.html, service-worker.js, server.js, package.json and Dockerfile. Replace these files in your existing Railway project and redeploy. No voice, avatar, or audio assets are required.

Changes:
- The theory visualization’s enlarge/reduce control is a single icon anchored at its bottom-right corner; the icon changes to reduce while expanded.
- Start and Target are now working view buttons. Start shows the position before the selected move and its arrow. Target shows the resulting position and the moved piece’s controlled squares. This is available in the trainer map and in the opening theory library.
- The full-cell amber/green highlight squares on the main board are replaced with small circular selection and move markers, removing the large translucent square over pieces.
- Arrow animation remains short and plays once; reduced-motion preferences are respected.

All trainer modes, opening explanations, bot play, settings and saved sessions remain included.
