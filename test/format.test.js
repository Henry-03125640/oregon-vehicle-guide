import test from "node:test";
import assert from "node:assert/strict";
import { tokenizeLinks } from "../public/format.js";

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
