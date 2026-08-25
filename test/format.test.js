import test from "node:test";
import assert from "node:assert/strict";
import { buildShareText, tokenizeLinks } from "../public/format.js";

test("turns HTTPS URLs into link tokens", () => {
  assert.deepEqual(tokenizeLinks("公式: https://www.oregon.gov/test"), [
    { type: "text", text: "公式: " },
    { type: "link", text: "https://www.oregon.gov/test", href: "https://www.oregon.gov/test" }
  ]);
});

test("keeps punctuation outside the link", () => {
  assert.deepEqual(tokenizeLinks("確認(https://www.oregon.gov/test)。"), [
    { type: "text", text: "確認(" },
    { type: "link", text: "https://www.oregon.gov/test", href: "https://www.oregon.gov/test" },
    { type: "text", text: ")。" }
  ]);
});

test("does not link non-HTTPS content", () => {
  assert.deepEqual(tokenizeLinks("javascript:alert(1)"), [{ type: "text", text: "javascript:alert(1)" }]);
});

test("builds one share body containing conversation and page URL", () => {
  const result = buildShareText("あなた:\n質問\n\nAI案内:\n回答", "https://example.com/");
  assert.match(result, /あなた:\n質問/);
  assert.match(result, /AI案内:\n回答/);
  assert.match(result, /案内サイト:\nhttps:\/\/example\.com\/$/);
});
