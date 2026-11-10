Chess Trainer 5.4.1 — natürlichere Coach-Stimme für Railway

ENTHALTEN
- index.html: aktualisierte Website mit natürlicher Voice-Option
- server.js und package.json: kleiner Railway-Server; hält den TTS-Schlüssel serverseitig
- service-worker.js: aktualisierte Offline-Version
- coach-avatars.png und mommy-sample.mp3: unveränderte Bild- und Vorschau-Dateien

RAILWAY AKTUALISIEREN
1. Ersetze im Projektordner die Dateien aus diesem Paket und behalte coach-avatars.png sowie mommy-sample.mp3 neben index.html.
2. Railway startet Node über `npm start` aus package.json oder über das beiliegende Dockerfile. Ersetze ein vorhandenes Dockerfile in deinem Railway-Projekt ebenfalls mit dem aus diesem Paket. Setze als Railway Variables:
   ELEVENLABS_API_KEY = dein geheimer ElevenLabs API-Schlüssel
   ELEVENLABS_VOICE_ID = ID deiner Stimme bei ElevenLabs
   ELEVENLABS_MODEL_ID = eleven_multilingual_v2 (optional; Standardwert)
3. Deploye neu und lade die Website einmal neu. Wenn bisher „Auto“ ausgewählt war, wählt die Website bei erreichbarem ElevenLabs nun automatisch die natürliche Stimme; bei einer anderen gespeicherten Stimme kannst du „Mommy · natural voice“ unter Move Coach auswählen.
4. API-Schlüssel nur in Railway Variables eintragen, niemals in index.html, GitHub oder in einer Nachricht.

STIMMEN-SAMPLE
Die beigefügte Aufnahme ist ungefähr 2,6 Sekunden lang. Sie reicht nicht aus, um daraus zuverlässig eine neue Stimme zu erstellen. ElevenLabs nennt für Instant Voice Cloning mindestens 10 Sekunden Audiomaterial und empfiehlt für bessere Ergebnisse 1–2 Minuten saubere Aufnahme. Erstelle die eigene Stimme in deinem ElevenLabs-Konto mit einer längeren Aufnahme und trage anschließend deren Voice ID in Railway ein. Die Website lädt deinen Sample nicht hoch.

NUTZUNG UND OFFLINE
- Die natürliche Stimme wird erst erzeugt, wenn die entsprechende Voice-Option sprechen soll. Dabei wird nur der Erklärungstext an ElevenLabs geschickt.
- Die Stimme verwendet dein ElevenLabs-Konto und kann dessen Kontingent bzw. Kosten verbrauchen.
- Der Server begrenzt die Textlänge und Anfragen pro Minute. Der API-Schlüssel bleibt auf Railway.
- Ohne Variablen, bei Anbieterfehlern und offline fällt die Seite auf die lokal verfügbare Browserstimme zurück. Die Beispielaufnahme kann weiterhin separat angehört werden.
