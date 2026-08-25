import { timingSafeEqual } from "node:crypto";

function safelyEqual(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function authorizeRequest(request, environment = process.env) {
  if (environment.REQUIRE_PRIVATE_ACCESS !== "true") return { authorized: true };

  const expectedPassword = environment.PRIVATE_SITE_PASSWORD;
  if (!expectedPassword) return { authorized: false, configurationError: true };

  const header = request.headers.authorization || "";
  if (!header.startsWith("Basic ")) return { authorized: false };

  try {
    const [username, password] = Buffer.from(header.slice(6), "base64").toString("utf8").split(":", 2);
    const expectedUsername = environment.PRIVATE_SITE_USERNAME || "owner";
    return { authorized: safelyEqual(username, expectedUsername) && safelyEqual(password, expectedPassword) };
  } catch {
    return { authorized: false };
  }
}

export function requestLogin(response, configurationError = false) {
  if (configurationError) {
    response.writeHead(503, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    response.end("Private access is not configured.");
    return;
  }

  response.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Oregon Vehicle Guide", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end("Authentication required.");
}
