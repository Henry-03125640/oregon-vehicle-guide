import test from "node:test";
import assert from "node:assert/strict";
import { FLOWS, SOURCES, publicKnowledge } from "../data/knowledge.js";

test("all guide flows contain actionable steps", () => {
  assert.ok(Object.keys(FLOWS).length >= 4);
  for (const flow of Object.values(FLOWS)) {
    assert.ok(flow.label);
    assert.ok(flow.steps.length >= 3);
  }
});

test("all sources are official Oregon government HTTPS pages", () => {
  for (const source of SOURCES) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "www.oregon.gov");
  }
});

test("public knowledge has a review date", () => {
  assert.match(publicKnowledge().lastReviewed, /^\d{4}-\d{2}-\d{2}$/);
});

