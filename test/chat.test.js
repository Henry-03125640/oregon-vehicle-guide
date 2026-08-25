import test from "node:test";
import assert from "node:assert/strict";
import { extractOutputText } from "../api/chat.js";

test("extracts SDK-style output_text", () => {
  assert.equal(extractOutputText({ output_text: "  回答です。  " }), "回答です。");
});

test("extracts text from a raw Responses API payload", () => {
  const result = {
    output: [
      { type: "reasoning", summary: [] },
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: "必要書類を確認してください。" }]
      }
    ]
  };
  assert.equal(extractOutputText(result), "必要書類を確認してください。");
});

test("returns empty text for an incomplete payload without content", () => {
  assert.equal(extractOutputText({ status: "incomplete", output: [] }), "");
});
