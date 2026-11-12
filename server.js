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
function sendError(res, status, error) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(JSON.stringify({ error }));
}
function serve(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { return sendError(res, 400, "invalid_path"); }
  if (pathname.startsWith("/api/")) return sendError(res, 404, "not_found");
  if (req.method !== "GET" && req.method !== "HEAD") return sendError(res, 405, "method_not_allowed");
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(ROOT, relative);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return sendError(res, 403, "forbidden");
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return sendError(res, 404, "not_found");
    const basename = path.basename(file);
    const headers = {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": basename === "index.html" || basename === "service-worker.js" ? "no-cache" : "public, max-age=3600"
    };
    if (basename === "service-worker.js") headers["Service-Worker-Allowed"] = "/";
    res.writeHead(200, headers);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  });
}
const server = http.createServer(serve);
server.listen(PORT, "0.0.0.0", () => console.log("Chess Trainer (repertoire update) listening on port", PORT));
