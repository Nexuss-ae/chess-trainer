const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".mp3": "audio/mpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", "Allow": "GET, HEAD" });
    return res.end("Method not allowed");
  }

  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); return res.end("Invalid path"); }

  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(ROOT, relative);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); return res.end("Not found"); }

    const name = path.basename(file);
    const contentType = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
    const compressible = /^(text\/|application\/(javascript|json))/.test(contentType);
    const acceptsGzip = /(?:^|,)\s*gzip\s*(?:,|$)/i.test(req.headers["accept-encoding"] || "");
    const gzip = compressible && acceptsGzip && stat.size > 512;

    res.writeHead(200, {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": name === "index.html" || name === "service-worker.js"
        ? "no-cache"
        : "public, max-age=86400",
      ...(gzip ? { "Content-Encoding": "gzip", "Vary": "Accept-Encoding" } : {}),
      ...(name === "service-worker.js" ? { "Service-Worker-Allowed": "/" } : {})
    });

    if (req.method === "HEAD") return res.end();
    const stream = fs.createReadStream(file);
    stream.on("error", () => { if (!res.headersSent) res.writeHead(500); res.destroy(); });
    if (gzip) stream.pipe(zlib.createGzip({ level: zlib.constants.Z_BEST_SPEED })).pipe(res);
    else stream.pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => console.log("Chess Trainer listening on port", PORT));
