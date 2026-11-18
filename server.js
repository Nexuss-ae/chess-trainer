const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const os = require("node:os");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const rooms = new Map();
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".mp3": "audio/mpeg", ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8"
};
function json(res, status, value) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(JSON.stringify(value));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; if (body.length > 12000) { reject(new Error("body_too_large")); req.destroy(); } });
    req.on("end", () => { try { resolve(JSON.parse(body || "{}")); } catch { reject(new Error("invalid_json")); } });
    req.on("error", reject);
  });
}
function roomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[crypto.randomInt(chars.length)];
  return code;
}
function findRoom(code) { return rooms.get(String(code || "").toUpperCase()); }
function getPlayer(room, token) { return Object.values(room.players).find(player => player.token === token); }
function clocksNow(room, now = Date.now()) {
  const clocks = { ...room.clocks };
  if (room.minutes && room.status === "playing") {
    const elapsed = Math.max(0, (now - room.lastTick) / 1000);
    clocks[room.turn] = Math.max(0, clocks[room.turn] - elapsed);
    if (clocks[room.turn] <= 0) {
      room.status = "finished";
      room.result = room.turn === "w" ? "0-1" : "1-0";
      room.reason = "timeout";
      room.clocks[room.turn] = 0;
    }
  }
  return clocks;
}
function roomView(room, player, now = Date.now()) {
  const clocks = clocksNow(room, now);
  const opponent = room.players[player.color === "w" ? "b" : "w"];
  return {
    code: room.code, color: player.color, status: room.status, minutes: room.minutes,
    clocks, turn: room.turn, revision: room.revision, fen: room.fen, history: room.history,
    result: room.result, reason: room.reason, opponentName: opponent?.name || "Waiting for opponent",
    opponentOnline: !!opponent && now - opponent.lastSeen < 12000
  };
}
function safeName(value) { return String(value || "Player").trim().replace(/[<>]/g, "").slice(0, 24) || "Player"; }
async function api(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/pvp/create") {
    const body = await readBody(req);
    const minutes = body.minutes === 0 ? 0 : Number(body.minutes);
    if (![0, 5, 10, 20, 30].includes(minutes)) return json(res, 400, { error: "Choose no clock, 5, 10, 20 or 30 minutes." });
    let code; do { code = roomCode(); } while (rooms.has(code));
    const now = Date.now(), token = crypto.randomBytes(18).toString("hex");
    const room = { code, minutes, status: "waiting", players: { w: { token, name: safeName(body.name), color: "w", lastSeen: now } }, turn: "w", revision: 0, fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", history: [], clocks: { w: minutes * 60, b: minutes * 60 }, lastTick: now, createdAt: now, result: null, reason: null };
    rooms.set(code, room); return json(res, 201, { ...roomView(room, room.players.w, now), token });
  }
  if (req.method === "POST" && url.pathname === "/api/pvp/join") {
    const body = await readBody(req), room = findRoom(body.code);
    if (!room) return json(res, 404, { error: "Lobby code not found." });
    if (room.status !== "waiting" || room.players.b) return json(res, 409, { error: "This lobby is already full or the game has started." });
    const now = Date.now(), player = { token: crypto.randomBytes(18).toString("hex"), name: safeName(body.name), color: "b", lastSeen: now };
    room.players.b = player; room.status = "playing"; room.lastTick = now;
    return json(res, 200, { ...roomView(room, player, now), token: player.token });
  }
  if (req.method === "GET" && url.pathname === "/api/pvp/state") {
    const room = findRoom(url.searchParams.get("code")), player = room && getPlayer(room, url.searchParams.get("token"));
    if (!room || !player) return json(res, 404, { error: "Lobby session not found. Rejoin with the lobby code." });
    player.lastSeen = Date.now(); return json(res, 200, roomView(room, player));
  }
  if (req.method === "POST" && url.pathname === "/api/pvp/move") {
    const body = await readBody(req), room = findRoom(body.code), player = room && getPlayer(room, body.token);
    if (!room || !player) return json(res, 404, { error: "Lobby session not found." });
    const now = Date.now(); clocksNow(room, now);
    if (room.status !== "playing") return json(res, 409, { error: "This game is no longer active." });
    if (body.revision !== room.revision) return json(res, 409, { error: "The board changed. It has been synchronized." });
    if (player.color !== room.turn) return json(res, 403, { error: "It is the other player's turn." });
    const fen = String(body.fen || ""), san = String(body.san || "");
    if (fen.length > 200 || fen.split(" ").length < 6 || san.length > 16 || fen.split(" ")[1] !== (room.turn === "w" ? "b" : "w")) return json(res, 400, { error: "Invalid move data." });
    const elapsed = Math.max(0, (now - room.lastTick) / 1000);
    if (room.minutes) room.clocks[room.turn] = Math.max(0, room.clocks[room.turn] - elapsed);
    if (room.minutes && room.clocks[room.turn] <= 0) { room.clocks[room.turn] = 0; room.status = "finished"; room.result = room.turn === "w" ? "0-1" : "1-0"; room.reason = "timeout"; return json(res, 409, { error: "Your clock ran out.", state: roomView(room, player, now) }); }
    room.fen = fen; room.history.push(san); room.turn = room.turn === "w" ? "b" : "w"; room.revision++; room.lastTick = now; player.lastSeen = now;
    if (["1-0", "0-1", "1/2-1/2"].includes(body.result)) { room.status = "finished"; room.result = body.result; room.reason = String(body.reason || "game_over").slice(0, 24); }
    return json(res, 200, roomView(room, player, now));
  }
  if (req.method === "POST" && url.pathname === "/api/pvp/resign") {
    const body = await readBody(req), room = findRoom(body.code), player = room && getPlayer(room, body.token);
    if (!room || !player) return json(res, 404, { error: "Lobby session not found." });
    if (room.status === "playing") { room.status = "finished"; room.result = player.color === "w" ? "0-1" : "1-0"; room.reason = "resignation"; }
    return json(res, 200, roomView(room, player));
  }
  if (req.method === "POST" && url.pathname === "/api/pvp/leave") {
    const body = await readBody(req), room = findRoom(body.code), player = room && getPlayer(room, body.token);
    if (!room || !player) return json(res, 404, { error: "Lobby session not found." });
    rooms.delete(room.code); return json(res, 200, { left: true });
  }
  return json(res, 404, { error: "not_found" });
}
function serve(req, res) {
  let url;
  try { url = new URL(req.url, "http://localhost"); } catch { return json(res, 400, { error: "invalid_path" }); }
  if (url.pathname.startsWith("/api/")) { api(req, res, url).catch(error => { if (!res.headersSent) json(res, error.message === "body_too_large" ? 413 : 400, { error: error.message || "request_failed" }); }); return; }
  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "method_not_allowed" });
  let pathname; try { pathname = decodeURIComponent(url.pathname); } catch { return json(res, 400, { error: "invalid_path" }); }
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, ""), file = path.resolve(ROOT, relative);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return json(res, 403, { error: "forbidden" });
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return json(res, 404, { error: "not_found" });
    const basename = path.basename(file), headers = { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Cache-Control": basename === "index.html" || basename === "service-worker.js" ? "no-cache" : "public, max-age=3600" };
    if (basename === "service-worker.js") headers["Service-Worker-Allowed"] = "/";
    res.writeHead(200, headers); if (req.method === "HEAD") return res.end(); fs.createReadStream(file).pipe(res);
  });
}
setInterval(() => { const now = Date.now(); for (const [code, room] of rooms) if (now - room.createdAt > 6 * 60 * 60 * 1000) rooms.delete(code); else if (room.status === "playing") clocksNow(room, now); }, 5000).unref();
const server = http.createServer(serve);
server.listen(PORT, "0.0.0.0", () => {
  console.log("Chess Trainer with PvP lobbies listening on port", PORT);
  console.log("On this computer: http://localhost:" + PORT);
  const addresses = Object.values(os.networkInterfaces()).flat().filter(item => item && (item.family === "IPv4" || item.family === 4) && !item.internal).map(item => item.address);
  for (const address of [...new Set(addresses)]) console.log("For devices on the same local network: http://" + address + ":" + PORT);
});
