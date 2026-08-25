import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import chatHandler from "./api/chat.js";
import { authorizeRequest, requestLogin } from "./auth.js";
import { publicKnowledge } from "./data/knowledge.js";

const PORT = Number(process.env.PORT || 3000);
const ROOT = new URL("./public/", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };

function sendJson(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === "/health") return sendJson(response, 200, { status: "ok" });
    const authorization = authorizeRequest(request);
    if (!authorization.authorized) return requestLogin(response, authorization.configurationError);
    if (url.pathname === "/api/chat") return chatHandler(request, response);
    if (url.pathname === "/api/guide") return sendJson(response, 200, publicKnowledge());

    const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    if (requested.includes("..")) return sendJson(response, 400, { error: "Invalid path" });
    const file = await readFile(join(ROOT, requested));
    response.writeHead(200, { "Content-Type": `${MIME[extname(requested)] || "application/octet-stream"}; charset=utf-8` });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") return sendJson(response, 404, { error: "Not found" });
    console.error("Server error", error);
    sendJson(response, 500, { error: "Server error" });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Oregon DMV Guide listening on port ${PORT}`);
});
