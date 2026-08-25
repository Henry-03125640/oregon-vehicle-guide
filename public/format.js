const URL_PATTERN = /https:\/\/[^\s<>"']+/g;
const TRAILING_PUNCTUATION = /[),.;!?、。]+$/;

export function tokenizeLinks(text) {
  const tokens = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    if (match.index > cursor) {
      tokens.push({ type: "text", text: text.slice(cursor, match.index) });
    }

    const rawUrl = match[0];
    const trailing = rawUrl.match(TRAILING_PUNCTUATION)?.[0] || "";
    const href = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;
    tokens.push({ type: "link", text: href, href });
    if (trailing) tokens.push({ type: "text", text: trailing });
    cursor = match.index + rawUrl.length;
  }

  if (cursor < text.length) tokens.push({ type: "text", text: text.slice(cursor) });
  return tokens;
}

