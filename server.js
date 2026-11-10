const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8"
};
const recentRequests = new Map();

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(body));
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; }
  catch { return false; }
}

function allowedByRateLimit(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const previous = (recentRequests.get(ip) || []).filter(time => now - time < 60_000);
  if (previous.length >= 18) return false;
  previous.push(now);
  recentRequests.set(ip, previous);
  if (recentRequests.size > 2500) {
    for (const [key, times] of recentRequests) if (!times.some(time => now - time < 60_000)) recentRequests.delete(key);
  }
  return true;
}

async function readJson(req, limit = 12_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error("Request too large"), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("Invalid JSON"), { status: 400 }); }
}

async function createSpeech(req, res) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) return json(res, 503, { error: "natural_voice_not_configured" });
  if (!sameOrigin(req)) return json(res, 403, { error: "origin_not_allowed" });
  if (!allowedByRateLimit(req)) return json(res, 429, { error: "rate_limit" });

  let input;
  try { input = await readJson(req); }
  catch (error) { return json(res, error.status || 400, { error: error.message }); }
  const text = typeof input.text === "string" ? input.text.trim() : "";
  if (!text || text.length > 1800) return json(res, 400, { error: "text_length_must_be_between_1_and_1800" });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const model = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
    const upstream = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voiceId) + "?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.42, similarity_boost: 0.82, style: 0.28, use_speaker_boost: true }
      }),
      signal: controller.signal
    });
    if (!upstream.ok) {
      const status = upstream.status;
      await upstream.body?.cancel().catch(() => {});
      console.warn("Speech provider rejected a request with status", status);
      if (status === 401 || status === 403) return json(res, 502, { error: "voice_provider_auth_or_voice_id" });
      if (status === 429) return json(res, 429, { error: "voice_provider_quota_or_rate_limit" });
      return json(res, 502, { error: "voice_provider_request_failed" });
    }
    const bytes = Buffer.from(await upstream.arrayBuffer());
    if (bytes.length > 8_000_000) return json(res, 502, { error: "audio_response_too_large" });
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": bytes.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(bytes);
  } catch (error) {
    console.error("Speech generation failed:", error.name || "Error");
    if (!res.headersSent) json(res, 502, { error: error.name === "AbortError" ? "voice_provider_timeout" : "voice_provider_unavailable" });
  } finally {
    clearTimeout(timeout);
  }
}

function serveStatic(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); }
  catch { return json(res, 400, { error: "invalid_path" }); }
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const file = path.resolve(ROOT, relative);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return json(res, 403, { error: "forbidden" });
  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) return json(res, 404, { error: "not_found" });
    const headers = {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": path.basename(file) === "index.html" || path.basename(file) === "service-worker.js" ? "no-cache" : "public, max-age=3600"
    };
    res.writeHead(200, headers);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/api/tts-status") {
    return json(res, 200, { configured: Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) });
  }
  if (req.method === "POST" && url.pathname === "/api/tts") return createSpeech(req, res);
  if (url.pathname.startsWith("/api/")) return json(res, 404, { error: "not_found" });
  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "method_not_allowed" });
  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, "0.0.0.0", () => console.log("Chess Trainer listening on port", PORT));
